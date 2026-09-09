/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      // ── Brand colors ──────────────────────────────────
      colors: {
        // Deep professional blue (primary)
        primary: {
          50:  '#e6f0ff',
          100: '#b3d1ff',
          200: '#80b3ff',
          300: '#4d94ff',
          400: '#1a75ff',
          500: '#0066ff',
          600: '#0052cc',   // main brand colour
          700: '#003d99',
          800: '#002966',
          900: '#001433',
          950: '#000a1a',
        },
        // Earth / green accent
        earth: {
          50:  '#f0faf4',
          100: '#d1f0df',
          200: '#a3e0bf',
          300: '#75d09f',
          400: '#47c07f',
          500: '#2da065',   // main earth colour
          600: '#248052',
          700: '#1b6040',
          800: '#12402d',
          900: '#09201a',
          950: '#041008',
        },
        // Neutral grays with slight blue tint (used in dark backgrounds)
        navy: {
          800: '#0d1424',
          900: '#070d18',
          950: '#030812',
        },
      },

      // ── Typography ────────────────────────────────────
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.65rem', { lineHeight: '1rem' }],
      },

      // ── Spacing extras ────────────────────────────────
      spacing: {
        18: '4.5rem',
        88: '22rem',
        112: '28rem',
        128: '32rem',
      },

      // ── Border radius ─────────────────────────────────
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },

      // ── Box shadows ───────────────────────────────────
      boxShadow: {
        'card':    '0 1px 3px 0 rgba(0,0,0,.06), 0 1px 2px -1px rgba(0,0,0,.06)',
        'card-md': '0 4px 6px -1px rgba(0,0,0,.07), 0 2px 4px -2px rgba(0,0,0,.07)',
        'card-lg': '0 10px 15px -3px rgba(0,0,0,.08), 0 4px 6px -4px rgba(0,0,0,.08)',
        'card-xl': '0 20px 25px -5px rgba(0,0,0,.08), 0 8px 10px -6px rgba(0,0,0,.08)',
        'glow':    '0 0 20px rgba(0,82,204,.35)',
        'glow-sm': '0 0 10px rgba(0,82,204,.25)',
      },

      // ── Keyframes & animations ────────────────────────
      keyframes: {
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to:   { opacity: '1', transform: 'translateY(0)'    },
        },
        fadeInDown: {
          from: { opacity: '0', transform: 'translateY(-16px)' },
          to:   { opacity: '1', transform: 'translateY(0)'     },
        },
        slideInLeft: {
          from: { opacity: '0', transform: 'translateX(-24px)' },
          to:   { opacity: '1', transform: 'translateX(0)'     },
        },
        slideInRight: {
          from: { opacity: '0', transform: 'translateX(24px)' },
          to:   { opacity: '1', transform: 'translateX(0)'    },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)'   },
          '50%':      { transform: 'translateY(-10px)' },
        },
        pulse_soft: {
          '0%, 100%': { opacity: '1'   },
          '50%':      { opacity: '0.5' },
        },
        spin_slow: {
          from: { transform: 'rotate(0deg)'   },
          to:   { transform: 'rotate(360deg)' },
        },
        ticker: {
          from: { transform: 'translateX(100%)'  },
          to:   { transform: 'translateX(-100%)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition:  '200% 0' },
        },
      },
      animation: {
        'fade-in':       'fadeIn 0.5s ease-out',
        'fade-in-up':    'fadeInUp 0.5s ease-out',
        'fade-in-down':  'fadeInDown 0.5s ease-out',
        'slide-in-left': 'slideInLeft 0.4s ease-out',
        'slide-in-right':'slideInRight 0.4s ease-out',
        'float':         'float 4s ease-in-out infinite',
        'pulse-soft':    'pulse_soft 2.5s ease-in-out infinite',
        'spin-slow':     'spin_slow 30s linear infinite',
        'ticker':        'ticker 30s linear infinite',
        'shimmer':       'shimmer 2s linear infinite',
      },

      // ── Transitions ───────────────────────────────────
      transitionDuration: {
        250: '250ms',
        350: '350ms',
        400: '400ms',
      },

      // ── Z-index extras ────────────────────────────────
      zIndex: {
        60:  '60',
        70:  '70',
        80:  '80',
        90:  '90',
        100: '100',
      },

      // ── Backdrop blur ─────────────────────────────────
      backdropBlur: {
        xs: '2px',
      },

      // ── Background size ───────────────────────────────
      backgroundSize: {
        '200': '200% 100%',
      },
    },
  },
  plugins: [],
};
