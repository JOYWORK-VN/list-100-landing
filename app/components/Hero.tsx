import Image from "next/image";
import { ClipboardCheck, FileSearch, Sparkles } from "lucide-react";

// SECTION 1 — Hero
// Layout dọc centered:
//   1. Masthead — JOYWORK trái, "Đồng hành bởi JOBVUI" phải
//   2. H1 — full width, căn giữa
//   3. Card "Về chương trình" — centered, ngay dưới H1 (anchor nội dung chính)
//   4. Banner miễn phí + 2 CTA — centered
//   5. Mô tả JOYWORK — text nhỏ, centered, đặt cuối cùng như tagline
export default function Hero() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden bg-deepspace text-white"
    >
      {/* Gradient nền — 2 lớp blur subtle, không dùng ảnh để tải nhanh */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 opacity-70"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 15% 20%, rgba(19,71,205,0.55), transparent 60%), radial-gradient(ellipse 60% 50% at 85% 80%, rgba(189,2,107,0.35), transparent 65%)",
        }}
      />

      <div className="container relative w-full py-6 sm:py-8">
        <div className="mx-auto max-w-6xl">
          {/* ── HÀNG 1 — Masthead: logos tách 2 đầu ── */}
          <div className="flex flex-col items-center justify-between gap-2 border-b border-white/10 pb-4 sm:flex-row sm:gap-6 sm:pb-5">
            <Image
              src="/joywork-logo-white.png"
              alt="JOYWORK"
              width={200}
              height={56}
              priority
              className="h-8 w-auto sm:h-9"
            />
            <div className="flex items-center gap-2.5">
              <span className="text-xs font-medium text-white/70 sm:text-sm">
                Đồng hành bởi
              </span>
              <span className="inline-flex rounded-md bg-white/95 px-2 py-1">
                <Image
                  src="/logo-jobvui.png"
                  alt="JOBVUI"
                  width={200}
                  height={104}
                  className="h-5 w-auto sm:h-6"
                />
              </span>
            </div>
          </div>

          {/* ── HÀNG 2 — H1 full width ── */}
          <h1
            id="hero-heading"
            className="mt-6 text-center text-3xl font-bold leading-[1.2] tracking-tight text-white sm:mt-7 sm:text-4xl lg:text-[2.75rem] xl:text-5xl xl:leading-[1.15]"
          >
            <span className="lg:whitespace-nowrap">
              Khảo sát và công bố{" "}
              <span className="bg-gradient-to-r from-joy-300 to-pink-300 bg-clip-text text-transparent">
                100 doanh nghiệp
              </span>
            </span>
            <br />
            có{" "}
            <span className="bg-gradient-to-r from-joy-300 to-pink-300 bg-clip-text text-transparent">
              môi trường làm việc tốt
            </span>
          </h1>

          {/* ── HÀNG 3 — Card "Về chương trình" trung tâm ── */}
          <div className="mx-auto mt-6 max-w-3xl rounded-2xl border border-white/15 bg-white/5 p-5 backdrop-blur sm:mt-7 sm:p-6">
            <div className="space-y-2.5 text-sm leading-[1.7] text-white/85 sm:text-base">
              <p>
                JOYWORK đang tìm kiếm{" "}
                <strong className="font-semibold text-white">
                  100 doanh nghiệp
                </strong>{" "}
                có chất lượng môi trường làm việc tốt thông qua khảo sát với
                chính các nhân viên đang làm việc tại đó.
              </p>
              <p>
                Chương trình này nhằm tạo ra{" "}
                <strong className="font-semibold text-white">
                  tiếng nói trung lập
                </strong>
                , bảo vệ và khuếch đại những giá trị văn hóa tích cực trong môi
                trường làm việc của các doanh nghiệp tại Việt Nam.
              </p>
            </div>
          </div>

          {/* ── HÀNG 4 — Banner miễn phí + 2 CTA ── */}
          <div className="mt-6 flex flex-col items-center gap-3 sm:mt-7">
            <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-pink-500 to-joy-500 px-4 py-1.5 text-sm font-semibold text-white shadow-lg shadow-pink-900/30">
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              Hoàn toàn miễn phí cho doanh nghiệp tham gia
            </div>

            <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-3">
              <a
                href="#dang-ky"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-joy-500 px-5 py-2.5 text-base font-semibold text-white shadow-lg shadow-joy-900/30 transition hover:bg-joy-400 focus-visible:ring-offset-deepspace"
              >
                <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
                Đăng ký tham gia
              </a>
              <a
                href="#lo-trinh-khao-sat"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/25 bg-white/5 px-5 py-2.5 text-base font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10 focus-visible:ring-offset-deepspace"
              >
                <FileSearch className="h-5 w-5" aria-hidden="true" />
                Xem phương pháp khảo sát
              </a>
            </div>
          </div>

          {/* ── HÀNG 5 — Mô tả JOYWORK (tagline cuối, nhỏ) ── */}
          <p className="mx-auto mt-5 max-w-3xl text-center text-xs leading-relaxed text-white/60 sm:mt-6">
            <span className="font-semibold text-white/80">JOYWORK</span> là nền
            tảng giúp các doanh nghiệp có môi trường làm việc tốt lên tiếng để
            làm{" "}
            <span className="font-semibold text-white/80">
              thương hiệu tuyển dụng
            </span>
            , từ đó thu hút những nhân sự phù hợp với công ty về cả văn hóa và
            kỹ năng.
          </p>
        </div>
      </div>
    </section>
  );
}
