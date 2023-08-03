/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx, html}",
    "./node_modules/tw-elements/dist/js/**/*.js"
  ],
  theme: {
    extend: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'mobile': {'max': '640px'}
      },
    },
  },
  plugins: [require("tw-elements/dist/plugin.cjs")],
  darkMode: 'class'
}
