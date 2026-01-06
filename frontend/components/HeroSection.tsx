"use client";

import { useAppStore } from "@/lib/store";
import { ArrowRight, Sparkles, TrendingUp, Users } from "lucide-react";

export default function HeroSection() {
  const { language } = useAppStore();

  const scrollToClassifier = () => {
    document
      .getElementById("classifier")
      ?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-primary-50 via-white to-primary-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 py-16 sm:py-24"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-primary-200 dark:border-primary-800 rounded-full px-4 py-2 mb-6">
            <Sparkles className="w-4 h-4 text-primary-600 dark:text-primary-400" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
              {language === "ja" ? "86.20%の精度" : "86.20% Accuracy"}
            </span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            {language === "ja" ? (
              <>
                AIを活用した
                <br />
                <span className="text-primary-600 dark:text-primary-400">
                  ゴミ分類システム
                </span>
              </>
            ) : (
              <>
                AI-Powered
                <br />
                <span className="text-primary-600 dark:text-primary-400">
                  Waste Classification
                </span>
              </>
            )}
          </h1>

          {/* Description */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {language === "ja"
              ? "写真を撮るだけで、正確なゴミの分類と収集日を瞬時に確認できます。日本のゴミ分別ルールに完全対応。"
              : "Simply snap a photo to instantly classify waste with accurate collection schedules. Fully compliant with Japanese waste segregation rules."}
          </p>

          {/* CTA Button */}
          <button
            onClick={scrollToClassifier}
            className="btn btn-primary text-base px-8 py-3 shadow-lg hover:shadow-xl transition-all inline-flex items-center gap-2"
          >
            {language === "ja" ? "今すぐ試す" : "Try It Now"}
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 mt-12 pt-12 border-t border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
            <div>
              <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 mb-2">
                <TrendingUp className="w-5 h-5" />
                <span className="text-2xl font-bold">86%</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "ja" ? "分類精度" : "Accuracy"}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 mb-2">
                <Sparkles className="w-5 h-5" />
                <span className="text-2xl font-bold">5</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "ja" ? "カテゴリー" : "Categories"}
              </p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 text-primary-600 dark:text-primary-400 mb-2">
                <Users className="w-5 h-5" />
                <span className="text-2xl font-bold">&lt;100ms</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {language === "ja" ? "処理速度" : "Processing"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
