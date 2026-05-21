import { ImageResponse } from "next/og";

// OG image động 1200x630 — Next.js 14 tự render khi build/preview, không cần file PNG.
// Áp dụng brand color và typography của JOYWORK.

export const runtime = "edge";
export const alt =
  "Khảo sát doanh nghiệp có môi trường làm việc tốt 2026 - JOYWORK";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px",
          backgroundColor: "#0B1230",
          backgroundImage:
            "radial-gradient(ellipse 80% 60% at 15% 20%, #1d52d4 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 80%, #BD026B 0%, transparent 65%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        {/* Header — brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div
            style={{
              fontSize: 22,
              fontWeight: 800,
              letterSpacing: "0.04em",
              color: "white",
            }}
          >
            JOYWORK
          </div>
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 999,
              background: "#BD026B",
            }}
          />
          <div
            style={{
              fontSize: 16,
              fontWeight: 500,
              color: "rgba(255,255,255,0.7)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            Chương trình 2026
          </div>
        </div>

        {/* Main */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              maxWidth: 1000,
              display: "flex",
              flexWrap: "wrap",
              gap: "0 18px",
            }}
          >
            <span>Khảo sát doanh nghiệp có</span>
            <span
              style={{
                background:
                  "linear-gradient(90deg, #7A9BF1, #F18BC0)",
                backgroundClip: "text",
                color: "transparent",
              }}
            >
              môi trường làm việc tốt
            </span>
            <span>2026</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "rgba(255,255,255,0.8)",
              maxWidth: 900,
              lineHeight: 1.35,
            }}
          >
            Xác thực qua khảo sát ẩn danh 3 lớp độc lập — báo cáo trực tiếp từ
            nhân viên.
          </div>
        </div>

        {/* Footer — 3 con số đặc trưng của chương trình */}
        <div style={{ display: "flex", gap: 48, alignItems: "flex-end" }}>
          <Stat value="3 lớp" label="Xác thực độc lập" />
          <Stat value="5 nhóm" label="Tiêu chí · 100đ" />
          <Stat value="Miễn phí" label="Cho DN 2026" />
        </div>
      </div>
    ),
    size
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: 56, fontWeight: 800, color: "white" }}>
        {value}
      </div>
      <div style={{ fontSize: 16, color: "rgba(255,255,255,0.7)" }}>
        {label}
      </div>
    </div>
  );
}
