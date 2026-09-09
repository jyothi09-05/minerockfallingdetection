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
        mine: {
          darkest: '#070A0F',
          dark: '#0B0F17',
          surface: '#121824',
          card: '#161F30',
          border: '#222F46',
          hover: '#1B263B',
          amber: '#F59E0B',
          'amber-glow': 'rgba(245, 158, 11, 0.15)',
          emerald: '#10B981',
          'emerald-glow': 'rgba(16, 185, 129, 0.15)',
          red: '#EF4444',
          'red-glow': 'rgba(239, 68, 68, 0.15)',
          cyan: '#06B6D4',
          slate: '#94A3B8'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'industrial': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'amber-glow': '0 0 15px rgba(245, 158, 11, 0.3)',
        'emerald-glow': '0 0 15px rgba(16, 185, 129, 0.3)',
        'red-glow': '0 0 15px rgba(239, 68, 68, 0.3)',
      }
    },
  },
  plugins: [],
}
