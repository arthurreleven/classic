/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./*.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#00072B',
          card: '#001C5F',
          accent: '#06B6D4',    /* Ciano */
          highlight: '#FF663D', /* Laranja */
          text: '#FFFFFF',
        },
      },
      fontFamily: {
        mono: ['monospace', 'ui-monospace', 'SFMono-Regular'],
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
        tech: ['"Rajdhani"', 'sans-serif'],
      },
      // Aqui definimos os Keyframes (o "como" se mexe)
      keyframes: {
        pipe: {
          '0%': { right: '-80px' },
          '100%': { right: '100%' },
        },
        clouds: {
          '0%': { right: '-550px' },
          '100%': { right: '100%' },
        },
        jump: {
          '0%, 100%': { bottom: '20vh' },
          '40%, 50%, 60%': { bottom: 'calc(20vh + 150px)' },
        },
        zoomIn: {
          '0%': { transform: 'scale(0.4)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        pulsar: {
          '0%': { textShadow: '0 0 10px #00aaff', opacity: '0.85' },
          '50%': { textShadow: '0 0 25px #00c8ff', opacity: '1' },
          '100%': { textShadow: '0 0 10px #00aaff', opacity: '0.85' },
        },
        pulseGlowColor: {
          '0%, 100%': { 
            textShadow: '0 0 5px #06B6D4', 
            color: '#06B6D4' 
          },
          '25%': { 
            textShadow: '0 0 15px #06B6D4, 0 0 25px #06B6D4', 
            color: '#06B6D4' 
          },
          '50%': { 
            textShadow: '0 0 5px #FF663D', 
            color: '#FF663D' 
          },
          '75%': { 
            textShadow: '0 0 15px #FF663D, 0 0 25px #FF663D', 
            color: '#FF663D' 
          },
        },
        shakeHands: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-5px)' },
          '50%': { transform: 'translateX(5px)' },
          '75%': { transform: 'translateX(-5px)' },
        }
      },
      // Aqui criamos as classes de utilidade (ex: animate-pipe)
      animation: {
        'pipe': 'pipe 1.5s infinite linear',
        'clouds': 'clouds 20s infinite linear',
        'jump': 'jump 500ms ease-out',
        'zoomIn': 'zoomIn 0.4s ease forwards',
        'pulsar': 'pulsar 2.5s infinite ease-in-out',
        'pulse-glow': 'pulseGlowColor 4s ease-in-out infinite',
        'shake': 'shakeHands 0.3s ease-in-out infinite',
      }
    },
  },
  plugins: [],
}