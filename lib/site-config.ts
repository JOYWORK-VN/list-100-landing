// Cấu hình site dùng chung cho metadata, sitemap, OG, JSON-LD.
// Khi deploy production, đặt env NEXT_PUBLIC_SITE_URL=https://joywork.vn
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://joywork.vn";

export const PAGE_PATH = "/list-100-doanh-nghiep-2026";
export const PAGE_URL = `${SITE_URL}${PAGE_PATH}`;

export const SITE_NAME = "JOYWORK";
