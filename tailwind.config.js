/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        brand: {
          primary: '#88A9B3',     // Cadet gray
          secondary: '#A3CCD0',   // Light blue
          soft: '#E8F3F2',        // Azure
          light: '#EDF6F9',       // Alice Blue
          muted: '#A6A6A6'        // Silver
        }
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
}
