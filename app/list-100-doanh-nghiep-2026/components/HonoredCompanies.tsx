"use client";

import { useState } from "react";
import { ArrowRight, Briefcase, ChevronDown, Eye, FileSearch } from "lucide-react";

// Tab "Danh sách doanh nghiệp có môi trường làm việc tốt" — danh sách đã đạt chuẩn.
// Dữ liệu hiện tại 50 DN mẫu, mock — khi production cần map sang dữ liệu thật
// kèm slug để tạo URL hồ sơ + tin tuyển dụng trên joywork.vn.
// 2 link "#" là placeholder, sẽ thay bằng URL thật khi có dữ liệu.
// Mặc định hiện 10 DN đầu, mỗi lần bấm "Xem thêm" → +10.
const PAGE_SIZE = 10;

const companies: string[] = [
  "Công ty Cổ phần Công nghệ Lavanet",
  "Công ty Cổ phần Nội thất Mộc An",
  "Công ty Cổ phần Tập đoàn Hùng Thắng",
  "Công ty Cổ phần Sáng tạo Inkpad Việt Nam",
  "Công ty Cổ phần Dịch vụ Lưu trú Mai House",
  "Công ty Cổ phần Yến Sào Khánh An",
  "Công ty Cổ phần Kim Cương Đông Á",
  "Công ty Cổ phần Giải pháp Phần mềm NextGen",
  "Công ty Cổ phần Học viện Kỹ năng Văn Lang",
  "Công ty Cổ phần Logistics Phúc Thịnh",
  "Công ty Cổ phần Trang trí Gỗ Saigon Wood",
  "Công ty Cổ phần Dược phẩm Việt Hà",
  "Công ty Cổ phần Truyền thông Bluewave",
  "Công ty Cổ phần Nông sản Đồng Xanh",
  "Công ty Cổ phần Du lịch An Khang",
  "Công ty Cổ phần Dịch vụ Ẩm thực Đào",
  "Công ty Cổ phần Giáo dục Brightway",
  "Công ty Cổ phần Đại Phát Thịnh",
  "Công ty Cổ phần Mỹ phẩm Tinh Hoa",
  "Công ty Cổ phần Âm thanh Hà Nội Audio Lab",
  "Công ty Cổ phần Bất động sản SunCity",
  "Công ty Cổ phần Năng lượng GreenTech",
  "Công ty Cổ phần Cà phê Vùng Cao",
  "Công ty Cổ phần Xây dựng Sao Mai",
  "Công ty Cổ phần Hoa Lan",
  "Công ty Cổ phần Dịch vụ CleanWorks",
  "Công ty Cổ phần May mặc Hoa Sen Apparel",
  "Công ty Cổ phần Không gian Làm việc Zenith",
  "Công ty Cổ phần Thủy sản Đại Dương",
  "Công ty Cổ phần Kỹ thuật Bách Khoa",
  "Công ty Cổ phần Sản xuất SkyMedia",
  "Công ty Cổ phần Y tế Pure Health",
  "Công ty Cổ phần Dịch vụ Cưới Việt Phong",
  "Công ty Cổ phần Thể hình UrbanFit",
  "Công ty Cổ phần Bảo hiểm Vạn Lộc",
  "Công ty Cổ phần Sách Phương Đông",
  "Công ty Cổ phần Giáo dục Smart Kids",
  "Công ty Cổ phần Nội thất Hoàng Gia",
  "Công ty Cổ phần Đồ uống Saigon Boba",
  "Công ty Cổ phần Biên dịch Trí Việt",
  "Công ty Cổ phần Du lịch Sinh thái Phú Yên",
  "Công ty Cổ phần Chăm sóc Sức khỏe Tâm An",
  "Công ty Cổ phần Thương mại Việt Đông",
  "Công ty Cổ phần Công nghệ SmartHome",
  "Công ty Cổ phần Phụ tùng Ô tô Anh Đức",
  "Công ty Cổ phần Truyền thông Spotlight",
  "Công ty Cổ phần Bánh ngọt Bình Minh",
  "Công ty Cổ phần Kiến trúc Vạn Xuân",
  "Công ty Cổ phần Vận tải Khải Hoàn",
  "Công ty Cổ phần Sáng tạo Joy Creative Lab",
];

const TOTAL = 100;

export default function HonoredCompanies() {
  const honored = companies.length;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const visible = companies.slice(0, visibleCount);
  const hasMore = visibleCount < honored;
  const remaining = honored - visibleCount;
  const nextBatch = Math.min(PAGE_SIZE, remaining);

  return (
    <section
      id="vinh-danh"
      aria-labelledby="vinh-danh-heading"
      className="bg-gray-50 py-20 sm:py-24"
    >
      <div className="container">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <h2
            id="vinh-danh-heading"
            className="text-3xl font-bold leading-tight text-deepspace sm:text-4xl"
          >
            Những doanh nghiệp đạt danh hiệu{" "}
            <span className="text-joy-600">
              “Doanh nghiệp có môi trường làm việc tốt”
            </span>
          </h2>
          <p className="mt-4 text-base text-deepspace-300 sm:text-lg">
            Các doanh nghiệp đã hoàn tất khảo sát và đạt chuẩn theo cơ chế
            khảo sát của JOYWORK.
          </p>

          {/* Progress: số DN đã đạt huy hiệu / 100 */}
          <div className="mx-auto mt-8 max-w-md">
            <div className="flex items-baseline justify-between gap-2 text-sm font-semibold text-deepspace">
              <span>Đã đạt huy hiệu</span>
              <span>
                <span className="text-3xl font-bold text-joy-500">{honored}</span>
                <span className="text-deepspace-300"> / {TOTAL}</span>
              </span>
            </div>
            <div
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-deepspace-50"
              role="progressbar"
              aria-valuenow={honored}
              aria-valuemin={0}
              aria-valuemax={TOTAL}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-joy-500 to-pink-500"
                style={{ width: `${(honored / TOTAL) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Danh sách DN — 1 cột để tên đầy đủ "Công ty Cổ phần ..." không bị cắt */}
        <ol className="mx-auto mt-14 max-w-5xl space-y-3">
          {visible.map((name, i) => (
            <li
              key={name}
              className="flex flex-col gap-3 rounded-xl border border-deepspace-50 bg-white p-4 transition hover:border-joy-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
            >
              <div className="flex min-w-0 items-start gap-3 sm:items-center">
                <span className="flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-pink-500 sm:text-sm">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-base font-semibold leading-snug text-deepspace sm:text-lg">
                  {name}
                </h3>
              </div>
              <div className="flex flex-shrink-0 gap-2">
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-deepspace-50 bg-white px-3 py-2 text-xs font-semibold text-deepspace transition hover:border-joy-200 hover:bg-joy-50 hover:text-joy-600 sm:text-sm"
                >
                  <Eye className="h-4 w-4" aria-hidden="true" />
                  Xem hồ sơ doanh nghiệp
                </a>
                <a
                  href="#"
                  className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-joy-500 bg-white px-3 py-2 text-xs font-semibold text-joy-600 transition hover:bg-joy-50 sm:text-sm"
                >
                  <Briefcase className="h-4 w-4" aria-hidden="true" />
                  Xem tin tuyển dụng
                </a>
              </div>
            </li>
          ))}
        </ol>

        {/* "Xem thêm" — load thêm 10 DN/lần; biến mất khi đã hiện hết */}
        <div className="mx-auto mt-8 flex max-w-5xl flex-col items-center gap-2">
          {hasMore ? (
            <>
              <button
                type="button"
                onClick={() =>
                  setVisibleCount((c) => Math.min(c + PAGE_SIZE, honored))
                }
                className="group inline-flex items-center gap-2 rounded-lg border border-joy-500 bg-white px-6 py-3 text-base font-semibold text-joy-600 transition hover:bg-joy-50"
              >
                Xem thêm {nextBatch} doanh nghiệp
                <ChevronDown
                  className="h-4 w-4 transition group-hover:translate-y-0.5"
                  aria-hidden="true"
                />
              </button>
              <p className="text-xs text-deepspace-300">
                Đang hiển thị {visibleCount} / {honored}
              </p>
            </>
          ) : (
            <p className="text-xs text-deepspace-300">
              Đã hiển thị tất cả {honored} doanh nghiệp
            </p>
          )}
        </div>

        {/* Footer CTA */}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border-2 border-joy-500 bg-white p-6 text-center sm:p-10">
          <p className="text-base font-medium leading-relaxed text-deepspace sm:text-lg">
            Danh sách đang tiếp tục được cập nhật.{" "}
            <span className="block mt-1">
              Doanh nghiệp của bạn có tự tin lọt vào danh sách này?
            </span>
          </p>
          <div className="mt-6 flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
            <a
              href="#dang-ky"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-joy-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-joy-900/20 transition hover:bg-joy-400"
            >
              Đăng ký tham gia khảo sát
              <ArrowRight
                className="h-4 w-4 transition group-hover:translate-x-0.5"
                aria-hidden="true"
              />
            </a>
            <a
              href="#lo-trinh-khao-sat"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-joy-500 bg-white px-6 py-3 text-base font-semibold text-joy-600 transition hover:bg-joy-50"
            >
              <FileSearch className="h-5 w-5" aria-hidden="true" />
              Xem phương pháp khảo sát
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
