"use client";

import { useAppStore } from "@/lib/store";

export default function CategoryShowcase() {
  const { language } = useAppStore();

  const categories = [
    {
      id: "glass",
      name_ja: "ガラス",
      name_en: "Glass",
      color: "#4A90E2",
      icon: "🍾",
      accuracy: "76%",
      collection_ja: "月2回",
      collection_en: "Twice/month",
    },
    {
      id: "metal",
      name_ja: "金属",
      name_en: "Metal",
      color: "#95A5A6",
      icon: "🥫",
      accuracy: "90%",
      collection_ja: "月1回",
      collection_en: "Once/month",
    },
    {
      id: "organic",
      name_ja: "燃えるゴミ",
      name_en: "Burnable",
      color: "#E74C3C",
      icon: "🍎",
      accuracy: "64%",
      collection_ja: "週2-3回",
      collection_en: "2-3x/week",
    },
    {
      id: "paper",
      name_ja: "紙類",
      name_en: "Paper",
      color: "#F39C12",
      icon: "📄",
      accuracy: "92%",
      collection_ja: "週1回",
      collection_en: "Weekly",
    },
    {
      id: "plastic",
      name_ja: "プラスチック",
      name_en: "Plastic",
      color: "#2ECC71",
      icon: "🧴",
      accuracy: "88%",
      collection_ja: "週1回",
      collection_en: "Weekly",
    },
  ];

  return (
    <section
      id="categories"
      className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ja" ? "分類カテゴリー" : "Classification Categories"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {language === "ja"
              ? "5つの主要なゴミカテゴリーに対応し、高精度な分類を実現"
              : "Supporting 5 major waste categories with high accuracy classification"}
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {categories.map((category) => (
            <div
              key={category.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-6 hover:shadow-lg transition-all hover:-translate-y-1"
            >
              {/* Icon */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 mx-auto"
                style={{ backgroundColor: `${category.color}20` }}
              >
                {category.icon}
              </div>

              {/* Name */}
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white text-center mb-2">
                {language === "ja" ? category.name_ja : category.name_en}
              </h3>

              {/* Accuracy Badge */}
              <div className="text-center mb-3">
                <span className="inline-block px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium rounded-full">
                  {category.accuracy} {language === "ja" ? "精度" : "accuracy"}
                </span>
              </div>

              {/* Collection */}
              <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                {language === "ja"
                  ? category.collection_ja
                  : category.collection_en}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
