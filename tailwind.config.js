/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./extension/**/*.{html,ts}",
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Add Inter font here
      },
      colors: {
        customGreen: '#2EBD59'
      }
    },
  },
  plugins: [],
};
