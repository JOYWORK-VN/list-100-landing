import SectionCTA from "./SectionCTA";

// SECTION — Lộ trình chương trình (4 giai đoạn, không có mốc thời gian cụ thể)
// Mobile: dọc với line nối; Desktop: 4 cột ngang với line nối ngang.

const phases = [
  {
    id: 1,
    title: "Chuẩn bị",
    description:
      "JOYWORK hoàn thiện công cụ khảo sát, thư mời, tài liệu. Mở cổng đăng ký cho doanh nghiệp.",
  },
  {
    id: 2,
    title: "Mời và khảo sát",
    description:
      "Tiếp cận các doanh nghiệp tiềm năng. Chốt danh sách doanh nghiệp đồng ý tham gia. Gửi khảo sát ẩn danh đến nhân viên. Tổ chức phỏng vấn trực tiếp tại văn phòng. Thu thập tài liệu nội bộ.",
  },
  {
    id: 3,
    title: "Đánh giá và chốt danh sách",
    description:
      "Hệ thống tổng hợp điểm khảo sát. Hội đồng chuyên môn JOYWORK xem xét kết quả phỏng vấn và tài liệu. Chốt danh sách doanh nghiệp đạt chuẩn. Gửi báo cáo insight cho từng doanh nghiệp.",
  },
  {
    id: 4,
    title: "Công bố và truyền thông",
    description:
      "Lễ công bố trên kênh truyền thông JOYWORK và đối tác PR. Spotlight từng doanh nghiệp. Truyền thông kéo dài để khai thác tối đa giá trị.",
  },
];

export default function Timeline() {
  return (
    <section
      id="lo-trinh"
      aria-labelledby="timeline-heading"
      className="bg-gray-50 py-20 sm:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-joy-500">
            4 giai đoạn
          </p>
          <h2
            id="timeline-heading"
            className="mt-3 text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            Lộ trình chương trình
          </h2>
          <p className="mt-4 text-base text-deepspace-300 sm:text-lg">
            Chương trình được triển khai qua 4 giai đoạn rõ ràng — từ chuẩn bị,
            khảo sát, đánh giá đến công bố và spotlight truyền thông.
          </p>
        </div>

        {/* Mobile: vertical with left rail line */}
        <ol className="mt-14 lg:hidden">
          {phases.map((p, idx) => (
            <li key={p.id} className="relative pl-14">
              {/* Rail nối dọc — ẩn ở item cuối */}
              {idx < phases.length - 1 && (
                <span
                  aria-hidden="true"
                  className="absolute left-[18px] top-10 h-[calc(100%-12px)] w-0.5 bg-joy-100"
                />
              )}
              {/* Số tròn */}
              <span
                className="absolute left-0 top-0 flex h-9 w-9 items-center justify-center rounded-full bg-joy-500 text-sm font-bold text-white shadow-sm shadow-joy-900/20"
                aria-hidden="true"
              >
                {p.id}
              </span>
              <div className="pb-10">
                <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
                  Giai đoạn {p.id}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-deepspace">
                  {p.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-deepspace-300">
                  {p.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        {/* Desktop: horizontal 4 cột với line nối ngang */}
        <ol className="relative mt-14 hidden lg:grid lg:grid-cols-4 lg:gap-6">
          {/* Line ngang chạy qua các số */}
          <span
            aria-hidden="true"
            className="absolute left-[10%] right-[10%] top-[18px] h-0.5 bg-joy-100"
          />
          {phases.map((p) => (
            <li key={p.id} className="relative">
              {/* Số tròn căn giữa cột */}
              <div className="flex justify-center">
                <span
                  className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-joy-500 text-sm font-bold text-white shadow-sm shadow-joy-900/20"
                  aria-hidden="true"
                >
                  {p.id}
                </span>
              </div>
              <div className="mt-6 rounded-2xl border border-deepspace-50 bg-white p-6">
                <p className="text-xs font-semibold uppercase tracking-wider text-pink-500">
                  Giai đoạn {p.id}
                </p>
                <h3 className="mt-1 text-lg font-semibold leading-snug text-deepspace">
                  {p.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-deepspace-300">
                  {p.description}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <SectionCTA tagline="Đăng ký ngay để JOYWORK liên hệ và hướng dẫn các bước tiếp theo." />
      </div>
    </section>
  );
}
