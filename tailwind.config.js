
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Adjust the path if needed
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))", // Make sure this matches your variable
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#2271b1",
          foreground: "#ffffff",
          hover: "#135e96",
        },
        secondary: {
          DEFAULT: "#6B7280",
          foreground: "#ffffff",
        },
        destructive: {
          DEFAULT: "#EF4444",
          foreground: "#ffffff",
        },
        success: {
          DEFAULT: "#10B981",
          foreground: "#ffffff",
        },
        warning: {
          DEFAULT: "#F59E0B",
          foreground: "#ffffff",
        },
        info: {
          DEFAULT: "#3B82F6",
          foreground: "#ffffff",
        }
      },
      spacing: {
        'section': '5rem',
        'subsection': '3rem',
        'component': '1.5rem',
      },
      fontSize: {
        'heading-1': ['2.5rem', { lineHeight: '1.2', fontWeight: '700' }],
        'heading-2': ['2rem', { lineHeight: '1.3', fontWeight: '700' }],
        'heading-3': ['1.5rem', { lineHeight: '1.4', fontWeight: '600' }],
        'heading-4': ['1.25rem', { lineHeight: '1.5', fontWeight: '600' }],
        'base-content': ['1rem', { lineHeight: '1.6' }],
      },
    },
  },
  plugins: [],
};
