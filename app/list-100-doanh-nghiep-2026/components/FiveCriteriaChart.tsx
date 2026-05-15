import {
  Target,
  GraduationCap,
  Users,
  Activity,
  Scale,
  ArrowRight,
  ClipboardCheck,
  ShieldCheck,
  FileText,
} from "lucide-react";

// SECTION — 5 nhóm tiêu chí đánh giá
// Layout 3 hàng cân đối:
//   Hàng 1: chart (5/12) + 5 tiêu chí dạng list dọc (7/12)
//   Hàng 2: "Điều kiện đạt chuẩn" — header + 3 stat cards (1/3 mỗi card) để
//           cân ngang với hàng 1
//   Hàng 3: 2 nút CTA — Đăng ký tham gia + Xem câu hỏi khảo sát
// Source-of-truth của mảng criteria nằm ở đây (sau khi gộp FiveCriteria.tsx).
export const criteria = [
  {
    icon: Target,
    name: "Rõ ràng & Minh bạch",
    scope:
      "Vai trò rõ ràng, kỳ vọng kết quả công việc minh bạch, phản hồi cụ thể từ quản lý",
  },
  {
    icon: GraduationCap,
    name: "Phát triển con người",
    scope:
      "Cơ hội học hỏi, mentor, được giao thử thách phù hợp, lộ trình phát triển nghề nghiệp",
  },
  {
    icon: Users,
    name: "Văn hóa & Quản trị",
    scope:
      "Quản lý lắng nghe, môi trường không có bắt nạt, lãnh đạo nhất quán giữa lời nói và việc làm",
  },
  {
    icon: Activity,
    name: "Tính bền vững",
    scope:
      "Khối lượng công việc hợp lý, deadline thực tế, làm thêm giờ là ngoại lệ",
  },
  {
    icon: Scale,
    name: "Phúc lợi & Công bằng",
    scope:
      "Lương tương xứng đóng góp, chính sách minh bạch, đối xử công bằng giữa các nhân viên",
  },
];

// viewBox vuông 600×600 — label dài được xuống dòng để không tràn ngoài viewBox.
const SIZE = 600;
const CX = SIZE / 2;
const CY = SIZE / 2;
const R = 180;
const LABEL_R = 215;
const SAMPLE_RATIO = 0.82;

// Tách thủ công các label dài thành nhiều dòng cho dễ đọc trong chart.
// Thứ tự khớp với mảng `criteria` (radar đi theo chiều kim đồng hồ từ đỉnh).
const labelLines: string[][] = [
  ["Rõ ràng & Minh bạch"],
  ["Phát triển", "con người"],
  ["Phúc lợi &", "Công bằng"],
  ["Tính bền vững"],
  ["Văn hóa &", "Quản trị"],
];

function pointOnAxis(i: number, k: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / criteria.length;
  return {
    x: CX + R * k * Math.cos(angle),
    y: CY + R * k * Math.sin(angle),
  };
}

function pointAt(i: number, radius: number) {
  const angle = -Math.PI / 2 + (i * 2 * Math.PI) / criteria.length;
  return {
    x: CX + radius * Math.cos(angle),
    y: CY + radius * Math.sin(angle),
  };
}

function polygonPoints(k: number) {
  return criteria
    .map((_, i) => {
      const p = pointOnAxis(i, k);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
}

export default function FiveCriteriaChart() {
  const labelAnchors: Array<"middle" | "start" | "end"> = [
    "middle",
    "start",
    "start",
    "end",
    "end",
  ];

  return (
    <section
      id="tieu-chi"
      aria-labelledby="criteria-chart-heading"
      className="bg-white py-20 sm:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-joy-500">
            5 nhóm tiêu chí
          </p>
          <h2
            id="criteria-chart-heading"
            className="mt-3 text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            5 nhóm tiêu chí đánh giá
            <br />
            chất lượng môi trường làm việc
          </h2>
        </div>

        <div className="mt-12 grid items-start gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Bên trái (5/12) — chart + cách tính điểm */}
          <div className="order-2 lg:order-1 lg:col-span-5">
            <svg
              viewBox={`0 0 ${SIZE} ${SIZE}`}
              role="img"
              aria-label="Biểu đồ radar 5 trục cho 5 nhóm tiêu chí"
              className="mx-auto w-full max-w-md"
            >
              <defs>
                <linearGradient id="radar-fill" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#1347CD" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#BD026B" stopOpacity="0.25" />
                </linearGradient>
              </defs>

              {[0.25, 0.5, 0.75, 1].map((k) => (
                <polygon
                  key={k}
                  points={polygonPoints(k)}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth={1.5}
                />
              ))}

              {criteria.map((_, i) => {
                const end = pointAt(i, R);
                return (
                  <line
                    key={i}
                    x1={CX}
                    y1={CY}
                    x2={end.x}
                    y2={end.y}
                    stroke="#E2E8F0"
                    strokeWidth={1.5}
                  />
                );
              })}

              <polygon
                points={polygonPoints(SAMPLE_RATIO)}
                fill="url(#radar-fill)"
                stroke="#1347CD"
                strokeWidth={2.5}
                strokeLinejoin="round"
              />

              {criteria.map((_, i) => {
                const p = pointOnAxis(i, SAMPLE_RATIO);
                return (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r={6}
                    fill="#1347CD"
                    stroke="#FFFFFF"
                    strokeWidth={2}
                  />
                );
              })}

              {criteria.map((c, i) => {
                const p = pointAt(i, LABEL_R);
                const lines = labelLines[i];
                const firstDy = `${-((lines.length - 1) * 0.55)}em`;
                return (
                  <text
                    key={c.name}
                    x={p.x}
                    y={p.y}
                    textAnchor={labelAnchors[i]}
                    dominantBaseline="middle"
                    className="fill-deepspace text-[18px] font-semibold"
                  >
                    {lines.map((line, k) => (
                      <tspan
                        key={k}
                        x={p.x}
                        dy={k === 0 ? firstDy : "1.1em"}
                      >
                        {line}
                      </tspan>
                    ))}
                  </text>
                );
              })}
            </svg>
          </div>

          {/* Bên phải (7/12) — danh sách 5 tiêu chí dạng dọc */}
          <ol className="order-1 space-y-3 lg:order-2 lg:col-span-7">
            {criteria.map((c, i) => {
              const Icon = c.icon;
              return (
                <li
                  key={c.name}
                  className="group flex gap-4 rounded-xl border border-deepspace-50 bg-gray-50/70 p-4 transition hover:border-joy-200 hover:bg-white sm:p-5"
                >
                  {/* Số thứ tự */}
                  <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-joy-500 to-pink-500 text-base font-bold text-white">
                    {i + 1}
                  </span>

                  {/* Nội dung */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-semibold leading-snug text-deepspace sm:text-lg">
                        <Icon
                          className="mr-2 inline h-4 w-4 align-[-2px] text-joy-500"
                          aria-hidden="true"
                        />
                        {c.name}
                      </h3>
                      <span className="flex flex-shrink-0 items-baseline gap-1 rounded-md bg-white px-2 py-0.5 text-xs font-bold text-joy-600 ring-1 ring-joy-100">
                        <span className="text-base leading-none">20</span>
                        <span className="text-[10px] font-medium uppercase tracking-wider text-deepspace-300">
                          điểm
                        </span>
                      </span>
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-deepspace-300">
                      {c.scope}
                    </p>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>

        {/* HÀNG 2 — Điều kiện đạt chuẩn: header + 3 stat cards */}
        <div className="mt-14 sm:mt-16">
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-joy-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-joy-600">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Điều kiện đạt chuẩn
            </span>
            <h3 className="mt-1 text-xl font-bold text-deepspace sm:text-2xl">
              Doanh nghiệp đạt cả 3 điều kiện sau sẽ vào danh sách
            </h3>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-3 md:gap-6">
            {/* Điều kiện 1 — 80% */}
            <div className="rounded-2xl border border-deepspace-50 bg-white p-6 text-center transition hover:border-joy-200 hover:shadow-sm sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-500">
                Điều kiện 1
              </p>
              <p className="mt-3 text-5xl font-bold leading-none text-joy-600 sm:text-6xl">
                80%
              </p>
              <p className="mt-3 text-sm leading-relaxed text-deepspace sm:text-base">
                Tỉ lệ tối thiểu nhân viên{" "}
                <strong>trả lời khảo sát hợp lệ</strong>
              </p>
            </div>

            {/* Điều kiện 2 — 70/100 */}
            <div className="rounded-2xl border border-deepspace-50 bg-white p-6 text-center transition hover:border-joy-200 hover:shadow-sm sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-500">
                Điều kiện 2
              </p>
              <p className="mt-3 flex items-baseline justify-center gap-1 text-5xl font-bold leading-none text-joy-600 sm:text-6xl">
                70
                <span className="text-2xl font-semibold text-deepspace-300 sm:text-3xl">
                  /100
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-deepspace sm:text-base">
                <strong>Tổng điểm khảo sát</strong> từ ngưỡng này trở lên
              </p>
            </div>

            {/* Điều kiện 3 — ≥ 10 điểm/nhóm */}
            <div className="rounded-2xl border border-deepspace-50 bg-white p-6 text-center transition hover:border-joy-200 hover:shadow-sm sm:p-7">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-pink-500">
                Điều kiện 3
              </p>
              <p className="mt-3 flex items-baseline justify-center gap-1 text-5xl font-bold leading-none text-joy-600 sm:text-6xl">
                ≥10
                <span className="text-xl font-semibold text-deepspace-300 sm:text-2xl">
                  đ
                </span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-deepspace sm:text-base">
                Không nhóm tiêu chí nào{" "}
                <strong>dưới 10 điểm</strong>
              </p>
            </div>
          </div>
        </div>

        {/* HÀNG 3 — CTA: Đăng ký tham gia + Xem câu hỏi khảo sát */}
        <div className="mt-12 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <a
            href="#dang-ky"
            className="group inline-flex items-center justify-center gap-2 rounded-lg bg-joy-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-joy-900/20 transition hover:bg-joy-400"
          >
            <ClipboardCheck className="h-5 w-5" aria-hidden="true" />
            Đăng ký tham gia
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </a>
          <a
            href="#cau-hoi-mau"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-joy-500 bg-white px-6 py-3 text-base font-semibold text-joy-600 transition hover:bg-joy-50"
          >
            <FileText className="h-5 w-5" aria-hidden="true" />
            Xem câu hỏi khảo sát
          </a>
        </div>
      </div>
    </section>
  );
}
