/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Poppins", "sans-serif"],
      },
      colors: {
        primary: {
          DEFAULT: "#2563eb",
          light: "#60a5fa",
        },
        glassLight: "rgba(255, 255, 255, 0.8)",
        glassDark: "rgba(15, 23, 42, 0.8)",
      },
      boxShadow: {
        glass: "0 18px 45px rgba(15, 23, 42, 0.25)",
      },
    },
  },
  plugins: [],
}
