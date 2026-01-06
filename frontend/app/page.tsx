"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";
import CategoryShowcase from "@/components/CategoryShowcase";
import PerformanceSection from "@/components/PerformanceSection";
import FAQSection from "@/components/FAQSection";
import ImageUpload from "@/components/ImageUpload";
import ResultCard from "@/components/ResultCard";
import Footer from "@/components/Footer";
import Spinner from "@/components/ui/Spinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import { useAppStore } from "@/lib/store";
import { checkHealth } from "@/lib/api";
import { AlertCircle } from "lucide-react";

export default function Home() {
  const [isHealthy, setIsHealthy] = useState<boolean | null>(null);
  const { isUploading, result, error, setError, language, reset } =
    useAppStore();

  useEffect(() => {
    checkHealth().then(setIsHealthy);
  }, []);

  if (isHealthy === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Spinner size="lg" />
          <p className="text-gray-600 dark:text-gray-300 mt-4">
            Initializing application...
          </p>
        </div>
      </div>
    );
  }

  if (isHealthy === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
        <div className="max-w-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 dark:text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Backend Unavailable
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Unable to connect to the classification service. Please ensure the
            backend server is running on port 8000.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Classifier Section */}
      <section id="classifier" className="py-16 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {language === "ja" ? "今すぐ分類" : "Classify Now"}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {language === "ja"
                ? "ゴミの写真をアップロードして分類を開始"
                : "Upload a photo of your waste to get started"}
            </p>
          </div>

          {/* Upload Section */}
          <div className="mb-8">
            <ImageUpload />
          </div>

          {/* Loading State */}
          {isUploading && (
            <div className="max-w-2xl mx-auto text-center py-12">
              <Spinner size="lg" />
              <p className="text-gray-600 dark:text-gray-300 mt-4 font-medium">
                {language === "ja" ? "画像を分析中..." : "Analyzing image..."}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                {language === "ja"
                  ? "しばらくお待ちください"
                  : "This will only take a moment"}
              </p>
            </div>
          )}

          {/* Error State */}
          {error && !isUploading && (
            <ErrorMessage message={error} onDismiss={() => setError(null)} />
          )}

          {/* Result Display */}
          {result && !isUploading && (
            <div>
              <ResultCard result={result} language={language} />
              <div className="max-w-2xl mx-auto mt-6 text-center">
                <button onClick={reset} className="btn btn-secondary">
                  {language === "ja"
                    ? "別の画像を分類"
                    : "Classify Another Image"}
                </button>
              </div>
            </div>
          )}

          {/* Info Section - Only show when no result */}
          {!result && !isUploading && !error && (
            <div className="max-w-2xl mx-auto mt-12">
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {language === "ja" ? "使い方" : "How to Use"}
                </h2>
                <ol className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-xs font-medium">
                      1
                    </span>
                    <span>
                      {language === "ja"
                        ? "ゴミの写真をアップロード"
                        : "Upload a photo of your waste item"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-xs font-medium">
                      2
                    </span>
                    <span>
                      {language === "ja"
                        ? "AIが自動的に分類"
                        : "AI automatically classifies the item"}
                    </span>
                  </li>
                  <li className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-xs font-medium">
                      3
                    </span>
                    <span>
                      {language === "ja"
                        ? "収集日と準備方法を確認"
                        : "View collection schedule and preparation instructions"}
                    </span>
                  </li>
                </ol>

                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                    {language === "ja"
                      ? "分類可能なカテゴリー"
                      : "Supported Categories"}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {[
                      { name_ja: "ガラス", name_en: "Glass", color: "#4A90E2" },
                      { name_ja: "金属", name_en: "Metal", color: "#95A5A6" },
                      {
                        name_ja: "燃えるゴミ",
                        name_en: "Organic",
                        color: "#E74C3C",
                      },
                      { name_ja: "紙類", name_en: "Paper", color: "#F39C12" },
                      {
                        name_ja: "プラスチック",
                        name_en: "Plastic",
                        color: "#2ECC71",
                      },
                    ].map((category) => (
                      <div
                        key={category.name_en}
                        className="text-center p-3 rounded-lg border border-gray-200 dark:border-gray-700"
                        style={{ backgroundColor: `${category.color}10` }}
                      >
                        <div
                          className="w-8 h-8 rounded-full mx-auto mb-2"
                          style={{ backgroundColor: category.color }}
                        />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">
                          {language === "ja"
                            ? category.name_ja
                            : category.name_en}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Category Showcase */}
      <CategoryShowcase />

      {/* Performance Section */}
      <PerformanceSection />

      {/* FAQ Section */}
      <FAQSection />

      {/* Footer */}
      <Footer />
    </div>
  );
}
