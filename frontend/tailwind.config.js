/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        vice: {
          pink: '#FF007F',
          magenta: '#FF2A85',
          hotpink: '#FF0055',
          cyan: '#00F0FF',
          aqua: '#00E5FF',
          gold: '#FFB800',
          orange: '#FF6B00',
          tangerine: '#FF8A00',
          lime: '#39FF14',
          purple: '#8B00FF',
          violet: '#BD00FF',
          dark: '#0B0416',
          midnight: '#05010C',
          surface: '#120826',
          card: '#160B2E',
          cardHover: '#201040',
        },
        primary: {
          DEFAULT: '#FF007F',
          glow: 'rgba(255, 0, 127, 0.5)',
          subtle: 'rgba(255, 0, 127, 0.15)',
        },
        accent: {
          DEFAULT: '#00F0FF',
          glow: 'rgba(0, 240, 255, 0.5)',
        },
        gold: {
          DEFAULT: '#FFB800',
          glow: 'rgba(255, 184, 0, 0.5)',
        },
      },
      fontFamily: {
        heading: ['Impact', 'Montserrat', 'Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        tech: ['Chakra Petch', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'vice-pink': '0 0 25px rgba(255, 0, 127, 0.45)',
        'vice-cyan': '0 0 25px rgba(0, 240, 255, 0.45)',
        'vice-gold': '0 0 25px rgba(255, 184, 0, 0.45)',
        'vice-purple': '0 0 35px rgba(139, 0, 255, 0.35)',
        'vice-inset': 'inset 0 0 20px rgba(255, 0, 127, 0.2)',
      },
      backgroundImage: {
        'vice-sunset': 'linear-gradient(135deg, #FF007F 0%, #FF8A00 50%, #00F0FF 100%)',
        'vice-gradient-dark': 'radial-gradient(ellipse at top, #240A42 0%, #0B0416 60%, #030008 100%)',
        'vice-card-gradient': 'linear-gradient(180deg, rgba(32, 16, 64, 0.7) 0%, rgba(18, 8, 38, 0.95) 100%)',
        'vice-glass': 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%)',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.02)' },
        },
        'neon-glow': {
          '0%, 100%': { filter: 'drop-shadow(0 0 10px #FF007F) drop-shadow(0 0 20px #FF007F)' },
          '50%': { filter: 'drop-shadow(0 0 18px #00F0FF) drop-shadow(0 0 30px #00F0FF)' },
        },
        'scanline': {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
      },
      animation: {
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite',
        'neon-glow': 'neon-glow 3s ease-in-out infinite',
        'scanline': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
};
