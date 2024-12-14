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
      fontSize: {
        '44': '2.7rem', // Custom font size (44px)
        '40': '2.5rem', // Custom font size (40px)
      },
      screens: {
        '544': '544px', // custom breakpoint
        'xs': '400px',
        '1050': '1050px'
      },
    },
  },
  plugins: [
    tailwindScrollbar,  // Applying the scrollbar plugin
  ],
};