import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      // Brand tokens JOYWORK
      colors: {
        // Joy Blue — màu chính
        joy: {
          50: "#EEF3FE",
          100: "#D7E2FB",
          200: "#A8BEF6",
          300: "#7A9BF1",
          400: "#4B77EC",
          500: "#1347CD", // primary
          600: "#0F39A4",
          700: "#0B2B7B",
          800: "#081D52",
          900: "#040F2A",
        },
        // Joy Pink — màu phụ (accent)
        pink: {
          50: "#FCE5F1",
          100: "#F9C2DF",
          200: "#F18BC0",
          300: "#E353A0",
          400: "#CF2A85",
          500: "#BD026B", // accent
          600: "#960255",
          700: "#700140",
          800: "#4A012B",
          900: "#250015",
        },
        // Deep Space — nền tối
        deepspace: {
          DEFAULT: "#0B1230",
          50: "#E7E8EE",
          100: "#C1C5D5",
          200: "#7F87A8",
          300: "#3D4978",
          500: "#0B1230",
          700: "#070C22",
          900: "#040611",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      // Container chuẩn
      container: {
        center: true,
        padding: {
          DEFAULT: "1rem",
          sm: "1.5rem",
          lg: "2rem",
        },
        screens: {
          sm: "640px",
          md: "768px",
          lg: "1024px",
          xl: "1200px",
          "2xl": "1280px",
        },
      },
    },
  },
  plugins: [],
};

export default config;
