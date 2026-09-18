/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter','Manrope','sans-serif']
      },
      colors: {
        coal: {
          100: '#15171C',
          200: '#13141A',
          300: '#111217',
          400: '#0F1014',
          500: '#0D0E12',
          600: '#0B0C10',
          black: '#000000',
          clarity: 'rgba(24, 25, 31, 0.50)',
        }
      }
    }
  }
};
