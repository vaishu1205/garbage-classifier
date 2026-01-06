"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X } from "lucide-react";
import LanguageToggle from "./LanguageToggle";
import { useAppStore } from "@/lib/store";
import DarkModeToggle from "./DarkModeToggle";
export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { language } = useAppStore();

  const navigation = [
    { name: language === "ja" ? "ホーム" : "Home", href: "#home" },
    {
      name: language === "ja" ? "使い方" : "How It Works",
      href: "#how-it-works",
    },
    {
      name: language === "ja" ? "カテゴリー" : "Categories",
      href: "#categories",
    },
    {
      name: language === "ja" ? "パフォーマンス" : "Performance",
      href: "#performance",
    },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ✅ REAL LOGO */}
          <Link href="#home" className="flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center">
              <Image
                src="/favicon.svg" // or /logo.png
                alt="Garbage Classifier Logo"
                width={40}
                height={40}
                priority
              />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-gray-900">
                Garbage Classifier
              </h1>
              <p className="text-xs text-gray-500">
                {language === "ja"
                  ? "AI駆動のゴミ分類"
                  : "AI-Powered Waste Management"}
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <DarkModeToggle />
            <LanguageToggle />
            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 text-gray-700" />
              ) : (
                <Menu className="w-5 h-5 text-gray-700" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
