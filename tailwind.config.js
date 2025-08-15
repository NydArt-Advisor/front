/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          darkBlue: '#30333d',
          slate: '#4d5364',
          coral: '#DA6743',
          salmon: '#F68A6E',
          sand: '#CEB683',
        },
        background: 'var(--color-background)',
        text: 'var(--color-text)',
      },
      fontFamily: {
        primary: ['var(--font-fredoka)'],
        secondary: ['var(--font-yeseva)'],
      },
    },
  },
  plugins: [],
} 