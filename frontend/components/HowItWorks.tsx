"use client";

import { useAppStore } from "@/lib/store";
import { Upload, Cpu, CheckCircle } from "lucide-react";

export default function HowItWorks() {
  const { language } = useAppStore();

  const steps = [
    {
      icon: Upload,
      title: language === "ja" ? "写真をアップロード" : "Upload Photo",
      description:
        language === "ja"
          ? "ゴミの写真をドラッグ＆ドロップまたはクリックして選択"
          : "Drag and drop or click to select a photo of your waste item",
    },
    {
      icon: Cpu,
      title: language === "ja" ? "AI分析" : "AI Analysis",
      description:
        language === "ja"
          ? "機械学習モデルが画像を分析し、正確なカテゴリーを判定"
          : "Machine learning model analyzes the image and determines the correct category",
    },
    {
      icon: CheckCircle,
      title: language === "ja" ? "結果表示" : "Get Results",
      description:
        language === "ja"
          ? "分類結果、収集日、準備方法を確認"
          : "View classification, collection schedule, and preparation instructions",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-16 sm:py-24 bg-white dark:bg-gray-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ja" ? "使い方" : "How It Works"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === "ja"
              ? "3つの簡単なステップで、正確なゴミの分類が完了します"
              : "Three simple steps to accurate waste classification"}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-gradient-to-r from-primary-200 dark:from-primary-800 to-transparent" />
              )}

              <div className="relative bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-8 hover:shadow-lg transition-shadow">
                {/* Step Number */}
                <div className="absolute -top-4 -left-4 w-8 h-8 bg-primary-600 dark:bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>

                {/* Icon */}
                <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-lg flex items-center justify-center mb-6 mx-auto">
                  <step.icon className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3 text-center">
                  {step.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-center">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
