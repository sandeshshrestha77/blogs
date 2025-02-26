
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        // Main color (70%) - Shades of blue
        primary: {
          DEFAULT: "#4169E1", // Royal Blue
          light: "#E6EEFF",
          dark: "#1E3A8A",
          foreground: "#FFFFFF",
        },
        // Secondary color (20%) - Shades of black/gray
        secondary: {
          DEFAULT: "#2C3E50",
          light: "#34495E",
          dark: "#1A252F",
          foreground: "#FFFFFF",
        },
        // Accent color (10%) - Light shades
        accent: {
          DEFAULT: "#F8FAFC",
          dark: "#E2E8F0",
          foreground: "#1E293B",
        },
        border: "#E2E8F0",
        input: "#E2E8F0",
        background: "#FFFFFF",
        foreground: "#1E293B",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
