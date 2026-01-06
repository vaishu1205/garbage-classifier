"use client";

import { PredictionResult } from "@/lib/types";
import { CheckCircle, AlertTriangle, Calendar } from "lucide-react";
import VoiceOutput from "./VoiceOutput";

interface ResultCardProps {
  result: PredictionResult;
  language: "ja" | "en";
}

export default function ResultCard({ result, language }: ResultCardProps) {
  const isJapanese = language === "ja";

  const confidenceColor =
    result.confidence_level === "high"
      ? "text-green-700 bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
      : result.confidence_level === "medium"
      ? "text-yellow-700 bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800"
      : "text-red-700 bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800";

  // Create text for voice output
  const voiceText = isJapanese
    ? `${result.japanese_name}。収集日は${
        result.collection_day_ja
      }です。準備方法：${result.preparation_steps
        .map((s) => s.japanese)
        .join("。")}`
    : `${result.english_name}. Collection day: ${
        result.collection_day_en
      }. Preparation: ${result.preparation_steps
        .map((s) => s.english)
        .join(". ")}`;

  return (
    <div className="card p-6 max-w-2xl mx-auto mt-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
            {isJapanese ? result.japanese_name : result.english_name}
          </h2>
          {isJapanese && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {result.hiragana}
            </p>
          )}
        </div>
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${result.color}20`, color: result.color }}
        >
          {result.icon}
        </div>
      </div>

      {/* Voice Output Button */}
      <div className="mb-4">
        <VoiceOutput text={voiceText} />
      </div>

      {/* Confidence */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium mb-4 ${confidenceColor}`}
      >
        {result.confidence_level === "high" ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <AlertTriangle className="w-4 h-4" />
        )}
        <span>Confidence: {result.confidence_percentage}</span>
      </div>

      {result.needs_confirmation && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <p className="text-sm text-yellow-800 dark:text-yellow-200">
            {isJapanese
              ? "確信度が低いため、確認してください。"
              : "Low confidence. Please verify the classification."}
          </p>
        </div>
      )}

      {/* Rest of component stays the same... */}
      {/* Description, Collection Schedule, Preparation Steps, etc. */}

      {/* ... (keep all existing code below) ... */}

      {/* Description */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          {isJapanese ? "説明" : "Description"}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isJapanese ? result.description_ja : result.description_en}
        </p>
      </div>

      {/* Collection Schedule */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {isJapanese ? "収集日" : "Collection Schedule"}
          </h3>
        </div>
        <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
          {isJapanese ? result.collection_day_ja : result.collection_day_en}
        </p>
      </div>

      {/* Preparation Steps */}
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
          {isJapanese ? "準備方法" : "Preparation Steps"}
        </h3>
        <ol className="space-y-2">
          {result.preparation_steps.map((step, index) => (
            <li key={index} className="flex gap-3 text-sm">
              <span className="flex-shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 flex items-center justify-center text-xs font-medium">
                {index + 1}
              </span>
              <span className="text-gray-700 dark:text-gray-300 flex-1">
                {isJapanese ? step.japanese : step.english}
              </span>
            </li>
          ))}
        </ol>
      </div>

      {/* Important Notes */}
      {(isJapanese ? result.notes_ja : result.notes_en).length > 0 && (
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            {isJapanese ? "注意事項" : "Important Notes"}
          </h3>
          <ul className="space-y-1">
            {(isJapanese ? result.notes_ja : result.notes_en).map(
              (note, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 dark:text-gray-400 flex items-start gap-2"
                >
                  <span className="text-gray-400 dark:text-gray-600 mt-0.5">
                    •
                  </span>
                  <span>{note}</span>
                </li>
              )
            )}
          </ul>
        </div>
      )}

      {/* Processing Time */}
      <div className="text-xs text-gray-400 dark:text-gray-600 text-right mt-4">
        Processed in {result.processing_time_ms.toFixed(0)}ms
      </div>
    </div>
  );
}
