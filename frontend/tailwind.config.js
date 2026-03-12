/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          300: '#f0e6a0',
          400: '#e8d46a',
          500: '#c89b3c',
          600: '#a07830',
        },
        lol: {
          dark: '#010a13',
          navy: '#0a1428',
          panel: '#091428',
          border: '#785a28',
          blue: '#0bc4e3',
          teal: '#0596aa',
        }
      },
      fontFamily: {
        beaufort: ['"Beaufort for LOL"', 'Georgia', 'serif'],
        spiegel: ['"Spiegel"', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'hex-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23785a28' fill-opacity='0.07'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }
    },
  },
  plugins: [],
};
