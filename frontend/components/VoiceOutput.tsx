"use client";

import { useState, useEffect } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { useAppStore } from "@/lib/store";

interface VoiceOutputProps {
  text: string;
  enabled?: boolean;
}

export default function VoiceOutput({
  text,
  enabled = true,
}: VoiceOutputProps) {
  const [speaking, setSpeaking] = useState(false);
  const [supported, setSupported] = useState(false);
  const { language } = useAppStore();

  useEffect(() => {
    setSupported("speechSynthesis" in window);
  }, []);

  const speak = () => {
    if (!supported || !text) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Set language
    utterance.lang = language === "ja" ? "ja-JP" : "en-US";
    utterance.rate = 0.9; // Slightly slower for clarity
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    setSpeaking(false);
  };

  if (!supported || !enabled) return null;

  return (
    <button
      onClick={speaking ? stop : speak}
      className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
      aria-label={speaking ? "Stop reading" : "Read aloud"}
    >
      {speaking ? (
        <>
          <VolumeX className="w-4 h-4" />
          <span>{language === "ja" ? "停止" : "Stop"}</span>
        </>
      ) : (
        <>
          <Volume2 className="w-4 h-4" />
          <span>{language === "ja" ? "読み上げ" : "Read Aloud"}</span>
        </>
      )}
    </button>
  );
}
