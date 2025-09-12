/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Base Colors
        brown: {
          600: "#26231E",
          500: "#43403B",
          400: "#75716B",
          300: "#DAD6D1",
          200: "#EFEEEB",
          100: "#F9F8F6",
        },
        white: "#FFFFFF",

        // Brand Colors
        orange: "#F2B68C",
        green: {
          primary: "#12B279",
          light: "#D7F2E9",
        },
        red: "#EB5164",

        // Legacy colors (keep for compatibility)
        "figma-primary": "#3B82F6",
        "figma-secondary": "#10B981",
        "figma-accent": "#F59E0B",
        "figma-gray": {
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
      },
    },
  },
  plugins: [],
};
