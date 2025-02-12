/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#00515B",
        secondary: "#008786",
        darkRed: "#761F15",
        darkOrange: "#DE7625",
        border: "#F5F3F3",
        black: "#1C1C1C",
        textContainer: "#111928",
        darkGreen: "#07223D",
        lightGray: "#E1DED5",
        brown: "#B2AA98",
        darkBrown: "#A79D86",
        lightOrange: "#FFE4C4",
        lightSecondary: "#8CA9A4",
        bgScreen: "#FBFAF6",
        bgLightGray: "#F3F2EC",
        trans50Pri: "#00515B80",
        tansPri15: "#00515B26",
        activePrimary: "#07AE96",
        activeSecondary: "#0885CD",
        lightPrimary: "#E6F9F4",
        backgroundHover: "#F6F6F6",
        tabDefault: "#EDEDED",
      },
    },
  },
  plugins: [],
};
