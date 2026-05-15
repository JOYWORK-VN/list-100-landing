// SECTION 10 — Footer
// Tone: tối giản, brand-aware. Logo JOYWORK in hoa + giới thiệu ngắn + 4 link + copyright.
export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-deepspace-700 text-white">
      <div className="container py-12 sm:py-14">
        <div className="grid gap-10 lg:grid-cols-[1.5fr_1fr] lg:gap-16">
          {/* Brand block */}
          <div>
            <div className="text-xl font-bold tracking-tight">JOYWORK</div>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-white/70">
              JOYWORK — Nền tảng giúp doanh nghiệp thể hiện văn hóa thật để
              thu hút nhân tài phù hợp.
            </p>
          </div>

          {/* Links */}
          <nav aria-label="Footer">
            <p className="text-xs font-semibold uppercase tracking-wider text-white/50">
              Liên kết
            </p>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              <li>
                <a
                  href="https://joywork.vn"
                  rel="noopener noreferrer"
                  className="text-sm text-white/85 transition hover:text-white"
                >
                  Trang chủ joywork.vn
                </a>
              </li>
              <li>
                <a
                  href="https://joywork.vn/ve-chung-toi"
                  rel="noopener noreferrer"
                  className="text-sm text-white/85 transition hover:text-white"
                >
                  Về JOYWORK
                </a>
              </li>
              <li>
                <a
                  href="https://joywork.vn/chinh-sach-bao-mat"
                  rel="noopener noreferrer"
                  className="text-sm text-white/85 transition hover:text-white"
                >
                  Chính sách bảo mật
                </a>
              </li>
              <li>
                <a
                  href="mailto:list100@joywork.vn"
                  className="text-sm text-white/85 transition hover:text-white"
                >
                  Liên hệ
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-xs text-white/50 sm:text-left">
          © {year} JOYWORK. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
