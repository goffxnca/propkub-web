/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.js", "./components/**/*.js"],
  theme: {
    extend: {
      colors: {
        primary: "#4f46e5",
        "primary-hover": "#4438ca",
        secondary: "#ffffff",
        "secondary-hover": "#f9fafb",
        accent: "#f97316",
        "accent-hover": "#d65b06",
        "gray-lighter": "#F5FAFF",
        "gray-light": "#edf1f9",
        "gray-medium": "#a3adcb",
        "gray-hard": "#616e96",
        "gray-harder": "##647392",
        "gray-heading": "",
        gray: {
          dark: "#222222",
          soft: "#717171",
        },
      },
      fontFamily: {
        sans: ["Prompt"],
        serif: ["Prompt"],
        display: ["Prompt"],
        body: ["Prompt"],
      },
    },
  },
  plugins: [require("@tailwindcss/forms"), require("@tailwindcss/typography")],
};
