import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { SITE_URL } from "@/lib/site-config";
import "./globals.css";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    absolute:
      "Khảo sát doanh nghiệp có môi trường làm việc tốt | JOYWORK",
  },
  description:
    "Chương trình xác thực doanh nghiệp có môi trường làm việc tốt 2026 từ JOYWORK. Đánh giá độc lập qua khảo sát ẩn danh nhân viên. Đăng ký miễn phí.",
  keywords: [
    "Khảo sát doanh nghiệp",
    "môi trường làm việc tốt",
    "JOYWORK",
    "doanh nghiệp 2026",
    "khảo sát văn hóa doanh nghiệp",
    "employer branding",
  ],
  applicationName: "JOYWORK",
  authors: [{ name: "JOYWORK", url: "https://joywork.vn" }],
  generator: "Next.js",
  referrer: "origin-when-cross-origin",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "JOYWORK",
    url: SITE_URL,
    title:
      "Khảo sát doanh nghiệp có môi trường làm việc tốt | JOYWORK",
    description:
      "Chương trình xác thực doanh nghiệp có môi trường làm việc tốt 2026 từ JOYWORK. Đánh giá độc lập qua khảo sát ẩn danh nhân viên.",
  },
  twitter: {
    card: "summary_large_image",
    site: "@joywork",
    title:
      "Khảo sát doanh nghiệp có môi trường làm việc tốt | JOYWORK",
    description:
      "Chương trình xác thực doanh nghiệp có môi trường làm việc tốt 2026. Khảo sát ẩn danh 3 lớp độc lập.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
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
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Khảo sát doanh nghiệp có môi trường làm việc tốt 2026",
    description:
      "Chương trình xác thực các doanh nghiệp có môi trường làm việc tốt 2026 từ JOYWORK qua khảo sát ẩn danh 3 lớp độc lập.",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: SITE_URL,
    },
    organizer: {
      "@type": "Organization",
      name: "JOYWORK",
      url: "https://joywork.vn",
    },
    url: SITE_URL,
    inLanguage: "vi-VN",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      url: SITE_URL,
      price: "0",
      priceCurrency: "VND",
      availability: "https://schema.org/InStock",
      validFrom: "2026-01-01",
    },
  };

  const orgJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "JOYWORK",
    url: "https://joywork.vn",
    logo: `${SITE_URL}/joywork-logo.png`,
    description:
      "JOYWORK — Nền tảng giúp doanh nghiệp thể hiện văn hóa thật để thu hút nhân tài phù hợp.",
    sameAs: [],
  };

  return (
    <html lang="vi" className={inter.variable}>
      <body className="min-h-screen">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
