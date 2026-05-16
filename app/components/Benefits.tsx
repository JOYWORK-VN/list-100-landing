import {
  Sparkles,
  Award,
  Megaphone,
  FileBarChart,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import SectionCTA from "./SectionCTA";

// SECTION Lợi ích — 4 lợi ích nâng cao vị thế tuyển dụng.
// Card 1 (Miễn phí) là FEATURED — gradient nền, ribbon riêng để nổi bật.
export default function Benefits() {
  return (
    <section
      id="loi-ich"
      aria-labelledby="benefits-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="container">
        {/* Section header — container rộng hơn (max-w-5xl) để dòng đầu của h2
            "4 lợi ích dành cho doanh nghiệp đạt danh hiệu" đủ chỗ 1 dòng trên
            sm+. Mobile vẫn được phép wrap tự nhiên để không tràn màn hình. */}
        <div className="mx-auto max-w-5xl text-center">
          <p className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-joy-500">
            <TrendingUp className="h-4 w-4" aria-hidden="true" />
            Lợi ích doanh nghiệp
          </p>
          <h2
            id="benefits-heading"
            className="mt-3 text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            <span className="sm:whitespace-nowrap">
              <span className="bg-gradient-to-r from-joy-500 to-pink-500 bg-clip-text text-transparent">
                4 lợi ích
              </span>{" "}
              dành cho doanh nghiệp đạt danh hiệu
            </span>
            <br />
            <span className="bg-gradient-to-r from-joy-500 to-pink-500 bg-clip-text text-transparent">
              Môi trường làm việc tốt
            </span>
          </h2>
        </div>

        {/* Grid 4 card — Card 1 FEATURED với gradient nền */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* ============ Card 1 — FEATURED: Miễn phí ============ */}
          <article className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-gradient-to-br from-joy-500 to-pink-500 p-6 text-white shadow-xl shadow-joy-900/20 sm:p-7">
            {/* Ribbon badge ở góc */}
            <div className="absolute right-0 top-5 rounded-l-full bg-white/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider backdrop-blur">
              ★ Hoàn toàn miễn phí
            </div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-white backdrop-blur">
              <Sparkles className="h-6 w-6" aria-hidden="true" />
            </div>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wider text-white/80">
              01
            </p>
            <h3 className="mt-1 text-lg font-bold leading-snug text-white">
              Miễn phí toàn bộ quá trình khảo sát và đánh giá
            </h3>
            <p className="mt-3 text-sm leading-relaxed text-white/90">
              Toàn bộ quá trình này được JOYWORK cung cấp và hướng dẫn cho doanh
              nghiệp mà không cần doanh nghiệp bỏ ra bất cứ chi phí nào.
            </p>
          </article>

          {/* ============ Card 2 — Truyền thông thương hiệu tuyển dụng ============ */}
          <BenefitCard
            number="02"
            icon={Megaphone}
            title="Truyền thông thương hiệu tuyển dụng để tiếp cận hàng ngàn ứng viên tiềm năng"
            description="Những điểm sáng trong môi trường làm việc của công ty sẽ được JOYWORK, JOBVUI và các đối tác truyền thông làm nổi bật trên nền tảng và trên các kênh social."
          />

          {/* ============ Card 3 — Huy hiệu xác thực ============ */}
          <BenefitCard
            number="03"
            icon={Award}
            title="Huy hiệu xác thực môi trường làm việc tốt — JOYWORK Workplace Verification"
            description="Huy hiệu này sẽ được gắn bên cạnh tên doanh nghiệp trên hồ sơ của doanh nghiệp tại JOYWORK, khiến cho các ứng viên nhìn vào đều biết rằng công ty bạn là nơi có môi trường làm việc tốt."
          />

          {/* ============ Card 4 — Báo cáo insight nội bộ ============ */}
          <BenefitCard
            number="04"
            icon={FileBarChart}
            title="Báo cáo insight nội bộ giúp bạn hiểu nhân viên của mình hơn"
            description={
              <>
                Từ dữ liệu của khảo sát, JOYWORK sẽ gửi cho doanh nghiệp một
                bản báo cáo nêu rõ{" "}
                <em>“cái nhìn của nhân sự trong tổ chức”</em> để DN cải thiện
                môi trường làm việc của mình.
              </>
            }
            note='Dù không lọt vào danh sách "môi trường làm việc tốt", doanh nghiệp vẫn sẽ nhận được báo cáo này.'
          />
        </div>

        <SectionCTA tagline="Đăng ký ngay để nhận đủ 4 lợi ích miễn phí." />
      </div>
    </section>
  );
}

// Card lợi ích thường (không featured). `note` là dòng chú thích nhỏ in nghiêng dưới mô tả.
function BenefitCard({
  number,
  icon: Icon,
  title,
  description,
  note,
}: {
  number: string;
  icon: LucideIcon;
  title: string;
  description: React.ReactNode;
  note?: string;
}) {
  return (
    <article className="group relative flex h-full flex-col rounded-2xl border border-deepspace-50 bg-white p-6 transition hover:border-joy-200 hover:shadow-sm sm:p-7">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-joy-50 text-joy-500 transition group-hover:bg-joy-500 group-hover:text-white">
          <Icon className="h-6 w-6" aria-hidden="true" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-pink-500">
          {number}
        </span>
      </div>
      <h3 className="mt-5 text-lg font-semibold leading-snug text-deepspace">
        {title}
      </h3>
      <p className="mt-3 text-sm leading-relaxed text-deepspace-300">
        {description}
      </p>
      {note && (
        <p className="mt-4 border-t border-deepspace-50 pt-3 text-xs italic leading-relaxed text-deepspace-300">
          {note}
        </p>
      )}
    </article>
  );
}
