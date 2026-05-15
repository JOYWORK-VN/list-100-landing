import { Building2, HeartHandshake, Eye, Check } from "lucide-react";
import SectionCTA from "./SectionCTA";

// SECTION 3 — Chân dung doanh nghiệp phù hợp
// 3 tiêu chí dạng checklist, hiển thị grid 3 cột trên desktop, dọc trên mobile.
export default function TargetCompany() {
  return (
    <section
      id="doanh-nghiep-phu-hop"
      aria-labelledby="target-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-joy-500">
            Chân dung phù hợp
          </p>
          <h2
            id="target-heading"
            className="mt-3 text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            Điều kiện để doanh nghiệp tham gia chương trình
          </h2>
          <p className="mt-4 text-base text-deepspace-300 sm:text-lg">
            Chương trình hướng đến những doanh nghiệp đã có nền tảng vận hành ổn
            định và sẵn sàng cho một đánh giá khách quan từ chính nhân sự trong
            tổ chức.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <CriteriaCard
            index={1}
            icon={<Building2 className="h-6 w-6" aria-hidden="true" />}
            title="Quy mô cơ bản"
            items={[
              "Có từ 15 nhân sự trở lên",
              "Có quy trình vận hành nội bộ tương đối ổn định",
            ]}
          />
          <CriteriaCard
            index={2}
            icon={<HeartHandshake className="h-6 w-6" aria-hidden="true" />}
            title="Nền tảng văn hóa tích cực"
            items={[
              "Được nhân sự đánh giá tốt",
              "Sẵn sàng để nhân viên nói thật về môi trường",
            ]}
          />
          <CriteriaCard
            index={3}
            icon={<Eye className="h-6 w-6" aria-hidden="true" />}
            title="Sẵn sàng minh bạch"
            items={[
              "Đồng ý cho JOYWORK khảo sát toàn bộ nhân sự (online, ẩn danh)",
              "Cho phép JOYWORK phỏng vấn ngẫu nhiên 1-2 nhân sự (nếu cần) để làm rõ insight trong khảo sát.",
            ]}
          />
        </div>

        <SectionCTA tagline="Doanh nghiệp phù hợp 3 tiêu chí trên? Đăng ký để JOYWORK liên hệ." />
      </div>
    </section>
  );
}

function CriteriaCard({
  index,
  icon,
  title,
  items,
}: {
  index: number;
  icon: React.ReactNode;
  title: string;
  items: string[];
}) {
  return (
    <article className="relative rounded-2xl border border-deepspace-50 bg-white p-6 transition hover:border-joy-200 hover:shadow-sm sm:p-7">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-joy-50 text-joy-500">
          {icon}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-pink-500">
          Tiêu chí {index}
        </span>
      </div>
      <h3 className="mt-5 text-xl font-semibold text-deepspace">{title}</h3>
      <ul className="mt-4 space-y-3">
        {items.map((item) => (
          <li
            key={item}
            className="flex gap-3 text-sm leading-relaxed text-deepspace-300 sm:text-base"
          >
            <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-joy-500 text-white">
              <Check className="h-3 w-3" strokeWidth={3} aria-hidden="true" />
            </span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </article>
  );
}
