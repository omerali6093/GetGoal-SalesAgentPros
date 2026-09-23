/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#070B14',
          secondary: '#0D1422',
          card: '#111827',
        },
        border: {
          DEFAULT: '#1E293B',
        },
        brand: {
          DEFAULT: '#2563EB',
          accent: '#38BDF8',
        },
        ink: {
          DEFAULT: '#F8FAFC',
          muted: '#94A3B8',
        },
        state: {
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
        },
      },
      fontFamily: {
        sans: ['"Inter"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(0,0,0,0.4), 0 8px 24px -12px rgba(0,0,0,0.5)',
        glow: '0 0 0 1px rgba(56,189,248,0.15), 0 8px 30px -10px rgba(37,99,235,0.35)',
      },
      keyframes: {
        pulseSoft: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.45 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-400px 0' },
          '100%': { backgroundPosition: '400px 0' },
        },
        fadeIn: {
          '0%': { opacity: 0, transform: 'translateY(4px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseSoft: 'pulseSoft 2.2s ease-in-out infinite',
        shimmer: 'shimmer 1.6s linear infinite',
        fadeIn: 'fadeIn 0.35s ease-out',
      },
    },
  },
  plugins: [],
}
