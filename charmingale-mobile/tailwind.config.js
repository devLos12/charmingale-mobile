/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        rose: "#C6195C",
        roseDeep: "#8E1145",
        blush: "#FDEDF2",
        ink: "#3D1024",
        gold: "#C79A46",
        muted: "#A8748A",
      },
    },
  },
  plugins: [],
}