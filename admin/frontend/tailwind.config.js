/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
        },
        gemstone: {
          ruby: '#e0115f',
          emerald: '#50c878',
          sapphire: '#0f52ba',
          diamond: '#b9f2ff',
          amethyst: '#9966cc',
        }
      },
      // Remove the animation extension as it's handled differently in v4
    },
  },
}