/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'a11y-primary': '#4A90E2',
        'a11y-secondary': '#34D399',
        'a11y-error': '#EF4444',
        'a11y-warning': '#F59E0B'
      },
      accessibility: {
        'high-contrast': {
          backgroundColor: '#000',
          color: '#FFF'
        }
      }
    },
  },
  plugins: [],
}
