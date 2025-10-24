/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* =====================
         * 🎨 Base Colors
         * ===================== */
        brown: {
          DEFAULT: "#43403B", // ใช้เป็นสีพื้นฐาน
          600: "#26231E",
          500: "#43403B",
          400: "#75716B",
          300: "#DAD6D1",
          200: "#EFEEEB",
          100: "#F9F8F6",
        },
        white: "#FFFFFF",

        /* =====================
         * 🌈 Brand Palette
         * ===================== */
        orange: {
          DEFAULT: "#F2B68C", // ใช้กับ bg-orange / text-orange
          100: "#FAE7D8",
          200: "#F7CBA8",
          300: "#F2B68C",
          400: "#EFA671",
        },
        green: {
          DEFAULT: "#12B279",
          light: "#D7F2E9",
          100: "#D7F2E9",
          200: "#A7E3C9",
          500: "#12B279",
          700: "#0E8A5D",
        },
        red: {
          DEFAULT: "#EB5164",
          100: "#FEE2E2",
          200: "#FCA5A5",
          500: "#EB5164",
          700: "#C13E50",
        },

        /* =====================
         * 🧱 Neutral / Gray
         * ===================== */
        gray: {
          50: "#F9FAFB",
          100: "#F3F4F6",
          200: "#E5E7EB",
          300: "#D1D5DB",
          400: "#9CA3AF",
          500: "#6B7280",
          600: "#4B5563",
          700: "#374151",
          800: "#1F2937",
          900: "#111827",
        },

        /* =====================
         * 🧩 Legacy (Figma Reference)
         * ===================== */
        "figma-primary": "#3B82F6",
        "figma-secondary": "#10B981",
        "figma-accent": "#F59E0B",
      },
    },
  },
  plugins: [],
};
