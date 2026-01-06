"use client";

import { useAppStore } from "@/lib/store";
import { BarChart3, Zap, Target, TrendingUp } from "lucide-react";

export default function PerformanceSection() {
  const { language } = useAppStore();

  const metrics = [
    {
      icon: Target,
      label: language === "ja" ? "全体精度" : "Overall Accuracy",
      value: "86.20%",
      description:
        language === "ja" ? "テストセット全体" : "Across all categories",
    },
    {
      icon: Zap,
      label: language === "ja" ? "処理速度" : "Processing Speed",
      value: "<100ms",
      description:
        language === "ja" ? "平均推論時間" : "Average inference time",
    },
    {
      icon: BarChart3,
      label: language === "ja" ? "最高精度" : "Top Accuracy",
      value: "92.05%",
      description: language === "ja" ? "紙類カテゴリー" : "Paper category",
    },
    {
      icon: TrendingUp,
      label: language === "ja" ? "モデルサイズ" : "Model Size",
      value: "14MB",
      description:
        language === "ja" ? "モバイル最適化済み" : "Mobile optimized",
    },
  ];

  return (
    <section
      id="performance"
      className="py-16 sm:py-24 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ja" ? "パフォーマンス" : "Performance Metrics"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === "ja"
              ? "高精度かつ高速な分類を実現する最新のAI技術"
              : "State-of-the-art AI technology delivering high accuracy and speed"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-primary-50 to-white dark:from-gray-800 dark:to-gray-900 border border-primary-100 dark:border-primary-900 rounded-xl p-6 hover:shadow-lg transition-shadow"
            >
              <metric.icon className="w-10 h-10 text-primary-600 dark:text-primary-400 mb-4" />
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {metric.value}
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                {metric.label}
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Category Breakdown */}
        <div className="mt-12 bg-gray-50 dark:bg-gray-800 rounded-xl p-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 text-center">
            {language === "ja" ? "カテゴリー別精度" : "Per-Category Accuracy"}
          </h3>
          <div className="space-y-4">
            {[
              {
                name: language === "ja" ? "紙類" : "Paper",
                value: 92.05,
                color: "#F39C12",
              },
              {
                name: language === "ja" ? "金属" : "Metal",
                value: 90.32,
                color: "#95A5A6",
              },
              {
                name: language === "ja" ? "プラスチック" : "Plastic",
                value: 87.67,
                color: "#2ECC71",
              },
              {
                name: language === "ja" ? "ガラス" : "Glass",
                value: 76.32,
                color: "#4A90E2",
              },
              {
                name: language === "ja" ? "燃えるゴミ" : "Burnable",
                value: 63.64,
                color: "#E74C3C",
              },
            ].map((category) => (
              <div key={category.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {category.name}
                  </span>
                  <span className="text-sm font-semibold text-gray-900 dark:text-white">
                    {category.value.toFixed(2)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${category.value}%`,
                      backgroundColor: category.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
