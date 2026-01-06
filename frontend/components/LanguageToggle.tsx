"use client";

import { useAppStore } from "@/lib/store";

export default function LanguageToggle() {
  const { language, setLanguage } = useAppStore();

  return (
    <div className="inline-flex rounded-lg border border-gray-300 bg-white p-1">
      <button
        onClick={() => setLanguage("ja")}
        className={`
          px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          ${
            language === "ja"
              ? "bg-primary-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        日本語
      </button>
      <button
        onClick={() => setLanguage("en")}
        className={`
          px-3 py-1.5 text-sm font-medium rounded-md transition-colors
          ${
            language === "en"
              ? "bg-primary-600 text-white"
              : "text-gray-700 hover:bg-gray-100"
          }
        `}
      >
        English
      </button>
    </div>
  );
}
