/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#051F20",
        card: "#235347",
        accent: "#8EB69B",
        lightBorder: "#DAF1DE",
        menuColor: "#163832",
      }
    },
  },
  plugins: [],
}