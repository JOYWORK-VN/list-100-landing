"use client";

import { useState, useEffect } from "react";
import { ArrowRight, Briefcase, ChevronDown, Eye, FileSearch, Loader2 } from "lucide-react";

const PAGE_SIZE = 10;
const TARGET_TOTAL = 100;

interface Company {
  id: string;
  name: string;
  profileUrl: string;
  jobsUrl: string;
  order: number;
}

export default function HonoredCompanies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    async function fetchCompanies() {
      try {
        const res = await fetch("/api/honored-companies");
        const json = await res.json();
        if (json.ok) {
          setCompanies(json.companies);
        } else {
          setError("Không thể tải dữ liệu");
        }
      } catch {
        setError("Đã xảy ra lỗi kết nối");
      } finally {
        setLoading(false);
      }
    }
    fetchCompanies();
  }, []);

  const honored = companies.length;
  const visible = companies.slice(0, visibleCount);
  const hasMore = visibleCount < honored;
  const remaining = honored - visibleCount;
  const nextBatch = Math.min(PAGE_SIZE, remaining);

  if (loading) {
    return (
      <section
        id="vinh-danh"
        aria-labelledby="vinh-danh-heading"
        className="bg-gray-50 py-20 sm:py-24"
      >
        <div className="container">
          <div className="flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-joy-500" />
            <p className="text-deepspace-300">Đang tải dữ liệu...</p>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section
        id="vinh-danh"
        aria-labelledby="vinh-danh-heading"
        className="bg-gray-50 py-20 sm:py-24"
      >
        <div className="container">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
            {error}
          </div>
        </div>
      </section>
    );
  }

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
              "Doanh nghiệp có môi trường làm việc tốt"
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
                <span className="text-deepspace-300"> / {TARGET_TOTAL}</span>
              </span>
            </div>
            <div
              className="mt-2 h-2.5 overflow-hidden rounded-full bg-deepspace-50"
              role="progressbar"
              aria-valuenow={honored}
              aria-valuemin={0}
              aria-valuemax={TARGET_TOTAL}
            >
              <div
                className="h-full rounded-full bg-gradient-to-r from-joy-500 to-pink-500"
                style={{ width: `${(honored / TARGET_TOTAL) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Danh sách DN — 1 cột để tên đầy đủ "Công ty Cổ phần ..." không bị cắt */}
        {companies.length > 0 ? (
          <>
            <ol className="mx-auto mt-14 max-w-5xl space-y-3">
              {visible.map((company, i) => (
                <li
                  key={company.id}
                  className="flex flex-col gap-3 rounded-xl border border-deepspace-50 bg-white p-4 transition hover:border-joy-200 hover:shadow-sm sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-5"
                >
                  <div className="flex min-w-0 items-start gap-3 sm:items-center">
                    <span className="flex-shrink-0 text-xs font-semibold uppercase tracking-wider text-pink-500 sm:text-sm">
                      {String(company.order || i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="text-base font-semibold leading-snug text-deepspace sm:text-lg">
                      {company.name}
                    </h3>
                  </div>
                  <div className="flex flex-shrink-0 gap-2">
                    <a
                      href={company.profileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-deepspace-50 bg-white px-3 py-2 text-xs font-semibold text-deepspace transition hover:border-joy-200 hover:bg-joy-50 hover:text-joy-600 sm:text-sm"
                    >
                      <Eye className="h-4 w-4" aria-hidden="true" />
                      Xem hồ sơ doanh nghiệp
                    </a>
                    <a
                      href={company.jobsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
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
          </>
        ) : (
          <div className="mx-auto mt-14 max-w-3xl rounded-xl border border-deepspace-50 bg-white p-8 text-center">
            <p className="text-deepspace-300">
              Chưa có doanh nghiệp nào được vinh danh. Hãy là người đầu tiên!
            </p>
          </div>
        )}

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
