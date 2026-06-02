/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'brutalist-black': '#0A0A0A',
        'brutalist-gold': '#FFD700',
        'brutalist-white': '#F0F0F0',
      },
      borderRadius: {
        'none': '0',
      },
    },
  },
  plugins: [],
}