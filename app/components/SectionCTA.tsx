import { ArrowRight } from "lucide-react";

// CTA dùng lại ở cuối mỗi section — luôn link về form đăng ký (#dang-ky)
// `tagline` tuỳ chọn: 1 câu ngắn dẫn dắt phù hợp ngữ cảnh của section đó.
// `buttonText` tuỳ chọn để override label nút (mặc định: "Đăng ký tham gia chương trình").
export default function SectionCTA({
  tagline,
  buttonText = "Đăng ký tham gia chương trình",
}: {
  tagline?: string;
  buttonText?: string;
}) {
  return (
    <div className="mt-12 flex flex-col items-center gap-3 text-center sm:mt-16">
      {tagline && (
        <p className="text-sm text-deepspace-300 sm:text-base">{tagline}</p>
      )}
      <a
        href="#dang-ky"
        className="group inline-flex items-center gap-2 rounded-lg bg-joy-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-joy-900/20 transition hover:bg-joy-400"
      >
        {buttonText}
        <ArrowRight
          className="h-4 w-4 transition group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
