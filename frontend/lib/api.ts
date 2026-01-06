/**
 * API Client for Backend Communication
 * Handles all HTTP requests with proper error handling
 */

import axios, { AxiosError } from "axios";
import { PredictionResult, APIError } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

// Axios instance with defaults
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get("/health");
    return response.data.status === "healthy" && response.data.model_loaded;
  } catch (error) {
    console.error("Health check failed:", error);
    return false;
  }
}

/**
 * Classify garbage image
 */
export async function classifyImage(
  file: File,
  language: "ja" | "en" | "both" = "both"
): Promise<PredictionResult> {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await apiClient.post<PredictionResult>(
      `/predict?language=${language}`,
      formData
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<APIError>;

      if (axiosError.response?.data) {
        throw new Error(
          axiosError.response.data.error || "Classification failed"
        );
      }

      if (axiosError.code === "ECONNABORTED") {
        throw new Error("Request timeout. Please try again.");
      }

      if (!axiosError.response) {
        throw new Error(
          "Cannot connect to server. Please ensure the backend is running."
        );
      }
    }

    throw new Error("An unexpected error occurred");
  }
}

/**
 * Validate file before upload
 */
export function validateImageFile(file: File): {
  valid: boolean;
  error?: string;
} {
  const maxSize = 10 * 1024 * 1024; // 10MB
  const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: "Invalid file type. Please upload JPEG, PNG, or WEBP images.",
    };
  }

  if (file.size > maxSize) {
    return {
      valid: false,
      error: `File too large. Maximum size is 10MB. Your file is ${(
        file.size /
        1024 /
        1024
      ).toFixed(2)}MB.`,
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: "File is empty. Please select a valid image.",
    };
  }

  return { valid: true };
}
