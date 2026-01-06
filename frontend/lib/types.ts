/**
 * Type definitions for Garbage Classifier API
 * Ensures type safety across the application
 */

export interface PreparationStep {
  japanese: string;
  english: string;
}

export interface PredictionResult {
  // Classification
  predicted_class: string;
  confidence: number;
  confidence_percentage: string;
  confidence_level: "high" | "medium" | "low";
  needs_confirmation: boolean;

  // Bilingual Names
  japanese_name: string;
  hiragana: string;
  english_name: string;

  // Descriptions
  description_ja: string;
  description_en: string;

  // Examples
  examples_ja: string[];
  examples_en: string[];

  // Collection Info
  collection_day_ja: string;
  collection_day_en: string;
  collection_frequency: string;

  // Instructions
  preparation_steps: PreparationStep[];
  notes_ja: string[];
  notes_en: string[];

  // Visual
  color: string;
  icon: string;

  // Metadata
  all_probabilities: Record<string, number>;
  processing_time_ms: number;
  timestamp: string;
}

export interface APIError {
  error: string;
  detail?: string;
  timestamp?: string;
}

export interface UploadState {
  file: File | null;
  preview: string | null;
  isUploading: boolean;
  result: PredictionResult | null;
  error: string | null;
}

export type Language = "ja" | "en";

export interface Category {
  id: string;
  name_ja: string;
  name_en: string;
  color: string;
}
