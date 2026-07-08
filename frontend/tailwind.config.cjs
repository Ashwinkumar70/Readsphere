/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#004741',
          hover: '#006A63',
          50:  '#E6F0EF',
          100: '#C0D8D6',
          200: '#96BCBA',
          300: '#6CA09E',
          400: '#4E8D8A',
          500: '#004741',
          600: '#003D38',
          700: '#00302D',
          800: '#002422',
          900: '#001715',
        },
        sand: {
          DEFAULT: '#F0EDE4',
        },
        card: {
          DEFAULT: '#FFFFFF',
        },
        textPrimary: {
          DEFAULT: '#1B1B1B',
        },
        textSecondary: {
          DEFAULT: '#6B7280',
        },
        brand: {
          border: '#DAD7CF',
        },
        accent: {
          DEFAULT: '#C89B3C',
          50:  '#FDF6E7',
          100: '#F9E8C3',
        },
        success: {
          DEFAULT: '#2E7D32',
        },
        warning: {
          DEFAULT: '#D97706',
        },
        error: {
          DEFAULT: '#DC2626',
        },
        info: {
          DEFAULT: '#2563EB',
        },
        // Semantic aliases used throughout pages
        background: '#F0EDE4',
        text:       '#1B1B1B',
        muted:      '#6B7280',
        border:     '#DAD7CF',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        heading: ['Outfit', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft':        '0 2px 8px rgba(0, 71, 65, 0.06)',
        'soft-lg':     '0 8px 24px rgba(0, 71, 65, 0.10)',
        'glow-sm':     '0 0 0 3px rgba(0, 71, 65, 0.15)',
        'glow':        '0 0 0 4px rgba(0, 71, 65, 0.20)',
        'elevation-0': 'none',
        'elevation-1': '0 2px 8px rgba(0, 71, 65, 0.04)',
        'elevation-2': '0 8px 24px rgba(0, 71, 65, 0.08)',
        'elevation-3': '0 16px 40px rgba(0, 71, 65, 0.12)',
        'elevation-4': '0 24px 60px rgba(0, 71, 65, 0.16)',
        'inner-soft':  'inset 0 1px 4px 0 rgba(0, 71, 65, 0.04)',
      },
      backgroundImage: {
        'gradient-primary':  'linear-gradient(135deg, #004741 0%, #006A63 100%)',
        'gradient-ambient': 'linear-gradient(135deg, rgba(0, 71, 65, 0.05) 0%, rgba(200, 155, 60, 0.05) 100%)',
        'gradient-card': 'linear-gradient(145deg, #ffffff 0%, #F8FAFC 100%)',
        'gradient-shimmer': 'linear-gradient(90deg, #F0EDE4 0%, #FFFFFF 50%, #F0EDE4 100%)',
      },
      animation: {
        'shimmer': 'shimmer 1.5s infinite',
        'fade-in': 'fade-in 0.2s ease-out',
        'slide-up': 'slide-up 0.3s ease-out',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        'slide-up': {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.7 },
        },
      },
      borderRadius: {
        'xl': '12px',
        '2xl': '16px',
        '3xl': '24px',
      },
      backdropBlur: {
        'xs': '2px',
      },
    },
  },
  plugins: [],
};
