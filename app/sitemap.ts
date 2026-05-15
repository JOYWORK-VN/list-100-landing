import type { MetadataRoute } from "next";
import { PAGE_URL } from "@/lib/site-config";

// Sitemap chỉ liệt kê trang landing duy nhất của app này.
// LƯU Ý: Khi tích hợp với joywork.vn, team cần thêm URL này vào sitemap chính
// hoặc cấu hình reverse-proxy cho phép truy cập /sitemap-list100.xml.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: PAGE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
  ];
}
