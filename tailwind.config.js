/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,tsx}", "./components/**/*.{js,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
      },
      colors: {
        "main-bg": "#1e1924",
        "main-text": "#b2aacd",
        "secondary-bg": "#483c58",
        "title-text": "#a78bfa",

        "hover-one": "#5a4c6b ",
        "hover-two": "#ab82ae ",
      },
    },
  },
  plugins: [],
};
