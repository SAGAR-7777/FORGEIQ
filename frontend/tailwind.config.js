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
        graphite: {
          950: '#080B10',
          900: '#0E131C',
          850: '#141B26',
          800: '#1B2433',
          750: '#222D3E',
          700: '#2A374C',
          600: '#3D4F6C',
          500: '#546A8E',
          400: '#7E92B0',
          300: '#AAB8CF',
          200: '#D5DFEE',
          100: '#F0F4FA',
        },
        forge: {
          cyan: '#00E5FF',
          blue: '#0284C7',
          emerald: '#10B981',
          amber: '#F59E0B',
          rose: '#EF4444',
          violet: '#8B5CF6'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      backgroundImage: {
        'industrial-grid': "radial-gradient(rgba(0, 229, 255, 0.08) 1px, transparent 1px)",
        'mesh-glow': "radial-gradient(circle at 50% 0%, rgba(0, 229, 255, 0.05) 0%, transparent 70%)",
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'flow-dash': 'dash 20s linear infinite',
      },
      keyframes: {
        dash: {
          to: { strokeDashoffset: '1000' },
        }
      }
    },
  },
  plugins: [],
}
