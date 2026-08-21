/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#0E4D3C",
          accent: "#1A6B54",
        },
        gold: {
          DEFAULT: "#D4A72C",
          light: "#E8C158",
        },
        ink: "#1A1A1A",
        surface: "#F4F6F4",
      },
    },
  },
  plugins: [],
};
