"use client";

import { useEffect, useState, type ReactNode } from "react";

// Tabs điều hướng dưới Hero — click để chuyển nội dung.
// Sticky để khi cuộn vẫn còn nút chuyển tab.
// Nghe URL hash:
//   - Nếu hash trùng id tab → switch sang tab đó.
//   - Nếu hash trùng id section khai báo trong `sections` của tab → switch sang
//     tab chứa section + scroll tới element. Dùng cho các cross-tab anchor link
//     (vd nút "Xem phương pháp khảo sát" ở Hero trỏ tới #lo-trinh-khao-sat
//     trong tab Thông tin chương trình).
type Tab = {
  id: string;
  label: string;
  content: ReactNode;
  sections?: string[];
};

export default function Tabs({ tabs }: { tabs: Tab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);

  useEffect(() => {
    const tabIds = new Set(tabs.map((t) => t.id));

    const syncFromHash = () => {
      const hash = window.location.hash.replace(/^#/, "");
      if (!hash) return;

      const scrollToHash = () => {
        // requestAnimationFrame để chờ React commit tab mới rồi mới scroll
        requestAnimationFrame(() => {
          const el = document.getElementById(hash);
          el?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      };

      if (tabIds.has(hash)) {
        setActiveId(hash);
        scrollToHash();
        return;
      }

      const owningTab = tabs.find((t) => t.sections?.includes(hash));
      if (owningTab) {
        setActiveId(owningTab.id);
        scrollToHash();
      }
    };

    syncFromHash();
    window.addEventListener("hashchange", syncFromHash);
    return () => window.removeEventListener("hashchange", syncFromHash);
  }, [tabs]);

  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];

  return (
    <>
      {/* Thanh tab — sticky, dùng brand tokens (deepspace + gradient joy→pink) */}
      <div className="sticky top-0 z-30 border-b border-deepspace-50 bg-white/95 backdrop-blur">
        <div className="container">
          <div
            role="tablist"
            aria-label="Nội dung chương trình"
            className="flex justify-center gap-1 overflow-x-auto sm:gap-2"
          >
            {tabs.map((tab) => {
              const isActive = tab.id === active?.id;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls={`panel-${tab.id}`}
                  id={`tab-${tab.id}`}
                  onClick={() => setActiveId(tab.id)}
                  className={[
                    "relative whitespace-nowrap px-3 py-4 text-sm font-semibold transition sm:px-5 sm:text-base",
                    isActive
                      ? "text-joy-600"
                      : "text-deepspace-300 hover:text-joy-600",
                  ].join(" ")}
                >
                  {tab.label}
                  {/* Underline indicator — gradient joy→pink khớp với Hero */}
                  <span
                    aria-hidden="true"
                    className={[
                      "absolute inset-x-2 bottom-0 h-[3px] rounded-full transition",
                      isActive
                        ? "bg-gradient-to-r from-joy-500 to-pink-500"
                        : "bg-transparent",
                    ].join(" ")}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Panel hiển thị nội dung tab đang chọn */}
      {active && (
        <div
          role="tabpanel"
          id={`panel-${active.id}`}
          aria-labelledby={`tab-${active.id}`}
        >
          {active.content}
        </div>
      )}
    </>
  );
}
