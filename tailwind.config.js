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
    },
  },
  plugins: [],
};
