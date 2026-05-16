import {
  Check,
  ClipboardCheck,
  Clock,
  FileBarChart,
  MessageSquareLock,
  Users,
  type LucideIcon,
} from "lucide-react";

// SECTION — Lộ trình doanh nghiệp tham gia khảo sát.
// Layout: 5 bước theo hàng ngang trên lg+; thông tin "thời gian 7 ngày" rút
// gọn thành chip dưới tiêu đề (Điều kiện đạt chuẩn đã chuyển sang section
// "5 nhóm tiêu chí" cho cân bố cục).
// Trên mobile/tablet stack dọc tự nhiên qua grid-cols-1/2/5.
type Step = {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
};

const steps: Step[] = [
  {
    number: 1,
    icon: ClipboardCheck,
    title: "Đăng ký tham gia",
    description: "Doanh nghiệp điền form đăng ký khảo sát trên trang JOYWORK.",
  },
  {
    number: 2,
    icon: Users,
    title: "Gửi danh sách email nhân viên",
    description:
      "JOYWORK gửi email xác nhận và hướng dẫn. Doanh nghiệp gửi lại danh sách email nhân sự (ẩn danh, không kèm thông tin cá nhân).",
  },
  {
    number: 3,
    icon: MessageSquareLock,
    title: "JOYWORK gửi khảo sát đến nhân viên",
    description:
      "Khảo sát gửi thẳng đến từng email nhân viên, không qua CEO hay HR — đảm bảo ẩn danh và trung thực.",
  },
  {
    number: 4,
    icon: Check,
    title: "Nhân viên hoàn thành khảo sát",
    description:
      "Nhân viên điền khảo sát trực tiếp trên đường dẫn JOYWORK gửi.",
  },
  {
    number: 5,
    icon: FileBarChart,
    title: "Tổng kết và gửi báo cáo insight",
    description:
      "JOYWORK kết luận doanh nghiệp có đạt tiêu chuẩn không, đồng thời gửi báo cáo insight về môi trường làm việc.",
  },
];

export default function EvaluationMethod() {
  return (
    <section
      id="lo-trinh-khao-sat"
      aria-labelledby="method-heading"
      className="bg-gray-50 py-20 sm:py-24"
    >
      <div className="container">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-joy-500">
            Quy trình khảo sát
          </p>
          <h2
            id="method-heading"
            className="mt-3 text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            Lộ trình doanh nghiệp tham gia khảo sát
          </h2>
          <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-joy-50 px-4 py-1.5 text-sm font-medium text-deepspace sm:text-base">
            <Clock className="h-4 w-4 text-joy-500" aria-hidden="true" />
            Thời gian hoàn tất: khoảng{" "}
            <strong className="text-joy-600">7 ngày</strong> kể từ khi đồng ý
            tham gia
          </p>
        </div>

        {/* 5 bước hàng ngang trên lg+, stack dọc trên mobile/tablet */}
        <ol className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-5 lg:gap-5">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <li
                key={s.number}
                className="group relative flex flex-col rounded-2xl border border-deepspace-50 bg-white p-5 transition hover:border-joy-200 hover:shadow-sm sm:p-6"
              >
                {/* Header row — số + icon */}
                <div className="flex items-center justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-joy-500 to-pink-500 text-lg font-bold text-white shadow-sm shadow-joy-900/20">
                    {s.number}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-joy-50 text-joy-500 transition group-hover:bg-joy-500 group-hover:text-white">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                </div>

                <p className="mt-4 text-[11px] font-semibold uppercase tracking-wider text-pink-500">
                  Bước {s.number}
                </p>
                <h3 className="mt-1 text-base font-bold leading-snug text-deepspace">
                  {s.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-deepspace-300">
                  {s.description}
                </p>
              </li>
            );
          })}
        </ol>

      </div>
    </section>
  );
}
