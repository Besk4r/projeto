/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html", // Vamos focar apenas no index.html por agora
    "./script.js"
  ],
  theme: {
    fontFamily:{
      'sans': ['poppins', 'sans-serif']
    },
    extend: {
      backgroundImage:{
        "home": "url('/assets/bg.png')"
      },
    },
  },
  plugins: [],
}