
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"], // Adjust the path if needed
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))", // Make sure this matches your variable
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
