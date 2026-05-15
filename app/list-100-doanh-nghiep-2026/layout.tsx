import type { Metadata } from "next";
import { SITE_URL, PAGE_URL } from "@/lib/site-config";

// SEO metadata cho riêng trang landing — override metadata root layout
export const metadata: Metadata = {
  // dùng absolute để bỏ qua template "%s | JOYWORK" của root layout
  // (nếu không sẽ nối thành "... | JOYWORK | JOYWORK")
  title: {
    absolute:
      "Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026 | JOYWORK",
  },
  description:
    "Chương trình xác thực doanh nghiệp có môi trường làm việc tốt 2026 từ JOYWORK. Đánh giá độc lập qua khảo sát ẩn danh nhân viên. Đăng ký miễn phí.",
  keywords: [
    "Danh sách Doanh nghiệp có Môi trường Làm việc Tốt",
    "JOYWORK",
    "môi trường làm việc tốt",
    "doanh nghiệp 2026",
    "khảo sát văn hóa doanh nghiệp",
    "employer branding",
  ],
  alternates: {
    canonical: PAGE_URL,
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "JOYWORK",
    url: PAGE_URL,
    title:
      "Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026 | JOYWORK",
    description:
      "Chương trình xác thực doanh nghiệp có môi trường làm việc tốt 2026 từ JOYWORK. Đánh giá độc lập qua khảo sát ẩn danh nhân viên.",
    // Ảnh OG được tạo động bởi app/list-100-doanh-nghiep-2026/opengraph-image.tsx
    // → Next.js tự thêm URL ảnh, không cần khai báo thủ công.
  },
  twitter: {
    card: "summary_large_image",
    site: "@joywork",
    title:
      "Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026 | JOYWORK",
    description:
      "Chương trình xác thực doanh nghiệp có môi trường làm việc tốt 2026. Khảo sát ẩn danh 3 lớp độc lập.",
    // Cùng ảnh OG động — Next.js tự gắn cho twitter:image
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

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Schema.org JSON-LD — Event + Organization
  // Giúp Google hiểu rõ đây là sự kiện/chương trình của JOYWORK
  const eventJsonLd = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: "Danh sách Doanh nghiệp có Môi trường Làm việc Tốt 2026",
    description:
      "Chương trình xác thực các doanh nghiệp có môi trường làm việc tốt 2026 từ JOYWORK qua khảo sát ẩn danh 3 lớp độc lập.",
    // Window cả năm 2026 để chương trình có thể linh động kéo dài
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: {
      "@type": "VirtualLocation",
      url: PAGE_URL,
    },
    organizer: {
      "@type": "Organization",
      name: "JOYWORK",
      url: "https://joywork.vn",
    },
    url: PAGE_URL,
    inLanguage: "vi-VN",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      url: PAGE_URL,
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
      />
      {children}
    </>
  );
}
