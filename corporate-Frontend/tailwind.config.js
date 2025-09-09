/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/**/*.{js,html}", "./src/**/*.{js,jsx,ts,tsx,html}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      transitionProperty: {
        height: "height",
      },
    },
  },
  plugins: [],
};
