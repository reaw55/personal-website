/** @type {import('tailwindcss').Config} */
import tailwindScrollbar from 'tailwind-scrollbar';

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",  // Scanning JS/TS/JSX/TSX files in the 'src' folder
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'], // Custom font family for 'Inter'
      },
      screens: {
        '544': '544px', // custom breakpoint
      },
    },
  },
  plugins: [
    tailwindScrollbar,  // Applying the scrollbar plugin
  ],
};