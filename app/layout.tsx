import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

// Inter có subset tiếng Việt — bắt buộc để dấu tiếng Việt nét đẹp
const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "JOYWORK — Nền tảng tuyển dụng bằng văn hóa",
    template: "%s | JOYWORK",
  },
  description:
    "JOYWORK giúp doanh nghiệp thể hiện văn hóa thật để thu hút nhân tài phù hợp.",
  applicationName: "JOYWORK",
  authors: [{ name: "JOYWORK", url: "https://joywork.vn" }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1347CD",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
