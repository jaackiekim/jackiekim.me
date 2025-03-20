/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0039D7',
          dark: '#002BB4',
        },
      },
      fontFamily: {
        sans: ['League Spartan', 'sans-serif'],
        serif: ['League Spartan', 'sans-serif'],
        mono: ['League Spartan', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
};