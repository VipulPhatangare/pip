/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'xs': '475px',
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        'tier-a': '#6366f1',
        'tier-b': '#8b5cf6',
        'tier-c': '#ec4899',
        'tier-d': '#ef4444'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite'
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      minHeight: {
        'screen-mobile': 'calc(100vh - 60px)',
      }
    },
  },
  plugins: [],
}
