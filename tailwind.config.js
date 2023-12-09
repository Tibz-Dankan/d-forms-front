/** @type {import('tailwindcss').Config} */
const withMT = require("@material-tailwind/react/utils/withMT");

module.exports = withMT({
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      screens: {
        xs: "480px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",
      },
      colors: {
        transparent: "transparent",
        primary: "#d6336c",
        primaryLight: "#faa2c1",
        primaryDark: "#a61e4d",
        secondary: "#1864ab",
        info: " #5BC0DE",
        warning: "#F0AD4E",
        error: "#D9534F",
        success: "#55C57A",
      },
      animation: {
        slideDown: "slideDown 0.5s ease-out forwards",
        opacityZeroToFull: "opacityZeroToFull 0.5s ease-out forwards",
      },
      keyframes: {
        slideDown: {
          "0%": { opacity: "0", transform: "translateY(-300px)" },
          "100%": { opacity: "1", transform: "translateY(0px)" },
        },
        opacityZeroToFull: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
});
