/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}", // Next.js App dir
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // class-based dark mode
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
};
