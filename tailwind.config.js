/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'bounce-delay': 'bounce 1s infinite 1s',
        'pulse-delay': 'pulse 2s infinite 0.5s',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};