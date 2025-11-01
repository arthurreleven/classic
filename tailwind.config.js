/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./*.html", // "Assiste" todos os arquivos HTML na raiz
  ],
  theme: {
    extend: {
      // Paleta de cores (sem mudança)
      colors: {
        'brand-dark': '#00072B',       
        'brand-card': '#001C5F',       
        'brand-accent': '#06B6D4',     
        'brand-highlight': '#FF663D',  
      },


      fontFamily: {
        'tech': ['Rajdhani', 'sans-serif']
      }
    },
  },
  plugins: [],
}