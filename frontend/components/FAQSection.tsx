"use client";

import { useState } from "react";
import { useAppStore } from "@/lib/store";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function FAQSection() {
  const { language } = useAppStore();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question:
        language === "ja"
          ? "どのくらいの精度で分類できますか？"
          : "How accurate is the classification?",
      answer:
        language === "ja"
          ? "全体の精度は86.20%です。カテゴリー別では、紙類が92.05%、金属が90.32%、プラスチックが87.67%の精度を実現しています。"
          : "The overall accuracy is 86.20%. By category: Paper at 92.05%, Metal at 90.32%, and Plastic at 87.67%.",
    },
    {
      question:
        language === "ja"
          ? "どんな画像フォーマットに対応していますか？"
          : "What image formats are supported?",
      answer:
        language === "ja"
          ? "JPEG、PNG、WEBP形式に対応しています。ファイルサイズは10MB以下である必要があります。"
          : "Supported formats include JPEG, PNG, and WEBP. Maximum file size is 10MB.",
    },
    {
      question:
        language === "ja"
          ? "処理にはどのくらい時間がかかりますか？"
          : "How long does processing take?",
      answer:
        language === "ja"
          ? "平均的な処理時間は100ミリ秒未満です。画像のアップロードから結果表示までは通常2〜3秒程度です。"
          : "Average processing time is under 100ms. From upload to result display typically takes 2-3 seconds.",
    },
    {
      question:
        language === "ja"
          ? "すべての地域のゴミ分別ルールに対応していますか？"
          : "Does it cover all regional waste rules?",
      answer:
        language === "ja"
          ? "主に東京都の基準に基づいていますが、日本全国で共通する基本的な分類に対応しています。地域によって収集日が異なる場合があります。"
          : "Based primarily on Tokyo Metropolitan standards but covers basic classifications common across Japan. Collection schedules may vary by region.",
    },
    {
      question:
        language === "ja"
          ? "アップロードした画像は保存されますか？"
          : "Are uploaded images stored?",
      answer:
        language === "ja"
          ? "いいえ、アップロードされた画像は処理後すぐに削除されます。個人情報やデータは一切保存されません。"
          : "No, uploaded images are deleted immediately after processing. No personal information or data is stored.",
    },
    {
      question:
        language === "ja"
          ? "モバイルデバイスでも使用できますか？"
          : "Can I use it on mobile devices?",
      answer:
        language === "ja"
          ? "はい、完全にレスポンシブ対応しており、スマートフォンやタブレットでも快適に使用できます。"
          : "Yes, it is fully responsive and works seamlessly on smartphones and tablets.",
    },
  ];

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 bg-gray-50 dark:bg-gray-800">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === "ja" ? "よくある質問" : "Frequently Asked Questions"}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {language === "ja"
              ? "ご不明な点がございましたら、お気軽にお問い合わせください"
              : "Have questions? We have answers"}
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <span className="font-medium text-gray-900 dark:text-white pr-4">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 dark:text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-600 dark:text-gray-300">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
