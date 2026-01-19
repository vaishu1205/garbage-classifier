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
  timeout: 120000, // 120 seconds (2 minutes) - increased for large images and cold starts
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

/**
 * Health check endpoint
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await apiClient.get("/health", { timeout: 10000 });
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
  language: "ja" | "en" | "both" = "both",
): Promise<PredictionResult> {
  try {
    // Compress image if it's too large (over 5MB)
    let fileToUpload = file;
    if (file.size > 5 * 1024 * 1024) {
      console.log("Large file detected, compressing...");
      fileToUpload = await compressImage(file);
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    const response = await apiClient.post<PredictionResult>(
      `/predict?language=${language}`,
      formData,
      {
        timeout: 120000, // 2 minutes for classification
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total,
            );
            console.log(`Upload progress: ${percentCompleted}%`);
          }
        },
      },
    );

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<APIError>;

      if (axiosError.response?.data) {
        throw new Error(
          axiosError.response.data.error || "Classification failed",
        );
      }

      if (axiosError.code === "ECONNABORTED") {
        throw new Error(
          "Request timeout. The server took too long to respond. Please try with a smaller image or try again later.",
        );
      }

      if (axiosError.code === "ERR_NETWORK") {
        throw new Error(
          "Network error. Please check your internet connection and try again.",
        );
      }

      if (!axiosError.response) {
        throw new Error(
          "Cannot connect to server. The backend might be starting up. Please wait a moment and try again.",
        );
      }

      // Handle specific status codes
      if (axiosError.response?.status === 413) {
        throw new Error("Image file is too large. Please use a smaller image.");
      }

      if (axiosError.response?.status === 504) {
        throw new Error(
          "Gateway timeout. The server is taking too long. Please try again.",
        );
      }
    }

    throw new Error("An unexpected error occurred. Please try again.");
  }
}

/**
 * Compress image before upload
 */
async function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;

        // Max dimension 1920px
        const maxDimension = 1920;
        if (width > height && width > maxDimension) {
          height = (height * maxDimension) / width;
          width = maxDimension;
        } else if (height > maxDimension) {
          width = (width * maxDimension) / height;
          height = maxDimension;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (blob) {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });
              console.log(
                `Compressed: ${(file.size / 1024 / 1024).toFixed(2)}MB → ${(
                  compressedFile.size /
                  1024 /
                  1024
                ).toFixed(2)}MB`,
              );
              resolve(compressedFile);
            } else {
              resolve(file);
            }
          },
          "image/jpeg",
          0.8, // 80% quality
        );
      };
      img.onerror = () => reject(new Error("Failed to load image"));
    };
    reader.onerror = () => reject(new Error("Failed to read file"));
  });
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
