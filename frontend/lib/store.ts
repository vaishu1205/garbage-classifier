import { create } from "zustand";
import { Language, PredictionResult } from "./types";

interface AppState {
  language: Language;
  isUploading: boolean;
  result: PredictionResult | null;
  error: string | null;
  setLanguage: (lang: Language) => void;
  setUploading: (status: boolean) => void;
  setResult: (result: PredictionResult | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  language: "ja",
  isUploading: false,
  result: null,
  error: null,
  setLanguage: (lang) => set({ language: lang }),
  setUploading: (status) => set({ isUploading: status }),
  setResult: (result) => set({ result, error: null }),
  setError: (error) => set({ error, result: null }),
  reset: () => set({ result: null, error: null, isUploading: false }),
}));
