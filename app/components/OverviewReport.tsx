"use client";

import { Download } from "lucide-react";
import { useEffect, useRef, useState } from "react";

// Tab "Báo cáo tổng quan" — nhúng báo cáo Workplace Insight 2026 dạng iframe.
// File HTML standalone tại /public/bao-cao-tong-quan/index.html. Iframe tự
// resize theo chiều cao nội dung qua postMessage (script trong file HTML).
// Mục đích: giữ thiết kế gốc của báo cáo (CSS riêng, không xung đột với
// Tailwind của app) đồng thời người dùng cuộn 1 thanh duy nhất.

const REPORT_URL = "/bao-cao-tong-quan/index.html";
const PDF_URL =
  "/bao-cao-tong-quan/assets/JOYWORK_BaoCao_ToanThiTruong_2026.pdf";
const INITIAL_HEIGHT = 1200; // chiều cao tạm trước khi nhận postMessage

export default function OverviewReport() {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [height, setHeight] = useState(INITIAL_HEIGHT);

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      const data = e.data;
      if (
        data &&
        typeof data === "object" &&
        data.source === "joywork-report" &&
        typeof data.height === "number" &&
        data.height > 0
      ) {
        setHeight(Math.ceil(data.height));
      }
    }
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <section
      id="bao-cao-tong-quan"
      aria-labelledby="report-heading"
      className="bg-white"
    >
      {/* Header trong app — giới thiệu + nút download PDF.
          Báo cáo HTML bên dưới có cover riêng của nó. */}
      <div className="border-b border-deepspace-50 bg-gray-50 py-10 sm:py-12">
        <div className="container">
          <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-joy-500">
                Workplace Insight 2026
              </p>
              <h2
                id="report-heading"
                className="mt-2 text-2xl font-bold leading-tight text-deepspace sm:text-3xl"
              >
                Báo cáo tổng quan thị trường 500 doanh nghiệp
              </h2>
              <p className="mt-2 text-sm text-deepspace-300 sm:text-base">
                Dữ liệu khảo sát ẩn danh 28.473 nhân viên · phát hành 06/2026
              </p>
            </div>
            <a
              href={PDF_URL}
              download="JOYWORK_BaoCao_ToanThiTruong_2026.pdf"
              className="inline-flex flex-shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-joy-500 to-pink-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-900/20 transition hover:opacity-95 sm:text-base"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Tải báo cáo PDF
            </a>
          </div>
        </div>
      </div>

      {/* Iframe báo cáo */}
      <iframe
        ref={iframeRef}
        src={REPORT_URL}
        title="JOYWORK Workplace Insight Report 2026"
        scrolling="no"
        style={{
          width: "100%",
          height: `${height}px`,
          border: 0,
          display: "block",
        }}
      />
    </section>
  );
}
