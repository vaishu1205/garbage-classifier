"use client";

import Link from "next/link";
import Image from "next/image";
import { useAppStore } from "@/lib/store";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";

/* =======================
   TYPES
======================= */
type FooterLink = {
  name: string;
  href: string;
  external?: boolean;
};

type FooterSection = {
  title: string;
  links: FooterLink[];
};

export default function Footer() {
  const { language } = useAppStore();

  const footerLinks: Record<string, FooterSection> = {
    product: {
      title: language === "ja" ? "製品" : "Product",
      links: [
        {
          name: language === "ja" ? "機能" : "Features",
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
        { name: "FAQ", href: "#faq" },
      ],
    },
    technology: {
      title: language === "ja" ? "技術" : "Technology",
      links: [
        { name: "TensorFlow", href: "#", external: true },
        { name: "Next.js", href: "#", external: true },
        { name: "FastAPI", href: "#", external: true },
        { name: "TypeScript", href: "#", external: true },
      ],
    },
    resources: {
      title: language === "ja" ? "リソース" : "Resources",
      links: [
        {
          name: language === "ja" ? "ドキュメント" : "Documentation",
          href: "#",
        },
        {
          name: language === "ja" ? "APIガイド" : "API Guide",
          href: "#",
        },
        {
          name: language === "ja" ? "ゴミ分別ルール" : "Segregation Rules",
          href: "#",
        },
        {
          name: language === "ja" ? "お問い合わせ" : "Contact",
          href: "#",
        },
      ],
    },
  };

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src="/favicon.svg" // or /logo.png
                alt="Garbage Classifier Logo"
                width={32}
                height={32}
                className="bg-white rounded-md p-1"
              />
              <span className="text-white font-bold text-lg">
                Garbage Classifier
              </span>
            </div>

            <p className="text-sm text-gray-400 mb-4">
              {language === "ja"
                ? "AIを活用した次世代のゴミ分類システム。日本の環境保護に貢献します。"
                : "Next-generation AI-powered waste classification system contributing to environmental protection in Japan."}
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="GitHub"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>

              <a
                href="#"
                aria-label="LinkedIn"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>

              <a
                href="#"
                aria-label="Email"
                className="w-9 h-9 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link Sections */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="text-white font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm hover:text-white transition-colors inline-flex items-center gap-1"
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                    >
                      {link.name}
                      {link.external && <ExternalLink className="w-3 h-3" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © {new Date().getFullYear()} Garbage Classifier{" "}
              {language === "ja" ? "全著作権所有。" : "All rights reserved."}
            </p>

            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">
                {language === "ja" ? "プライバシーポリシー" : "Privacy Policy"}
              </a>
              <a href="#" className="hover:text-white transition-colors">
                {language === "ja" ? "利用規約" : "Terms of Service"}
              </a>
            </div>
          </div>
        </div>

        {/* Tech Stack */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-xs text-gray-500">
            {language === "ja" ? "技術スタック:" : "Built with:"} Next.js ·
            TypeScript · TensorFlow · FastAPI · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
}
