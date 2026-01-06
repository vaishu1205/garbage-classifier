import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Garbage Classifier | Japanese Waste Segregation",
  description:
    "AI-powered garbage classification system for Japanese waste management. Accurate, fast, and bilingual support.",
  keywords: [
    "garbage classification",
    "waste management",
    "Japan",
    "recycling",
    "AI",
    "machine learning",
  ],
  authors: [{ name: "Garbage Classifier Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#0ea5e9",
  robots: "index, follow",

  /** 🔹 FAVICON & APP ICONS */
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  /** 🔹 OPEN GRAPH (Social + Google) */
  openGraph: {
    title: "Garbage Classifier",
    description:
      "AI-powered garbage classification for Japanese waste management",
    type: "website",
    locale: "ja_JP",
    siteName: "Garbage Classifier",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <head>
        {/* 🔹 Google Organization Logo (IMPORTANT) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Garbage Classifier",
              logo: "https://YOUR_DOMAIN.com/logo.png",
            }),
          }}
        />
      </head>

      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
