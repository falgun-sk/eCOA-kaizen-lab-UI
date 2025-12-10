/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'light-orange': '#FFE5D9',
        'orange-primary': '#FFB088',
        'orange-secondary': '#FF8C61',
        'orange-accent': '#FF7043',
      },
    },
  },
  plugins: [],
}
