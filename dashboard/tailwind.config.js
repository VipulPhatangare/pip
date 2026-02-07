/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'tier-a': '#6366f1',
        'tier-b': '#8b5cf6',
        'tier-c': '#ec4899',
        'tier-d': '#ef4444'
      }
    },
  },
  plugins: [],
}
