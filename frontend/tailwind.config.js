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
        primary: {
          DEFAULT: '#fdbf15',
          glow: 'rgba(253, 191, 21, 0.4)',
          subtle: 'rgba(253, 191, 21, 0.12)',
        },
        accent: {
          DEFAULT: '#ff007f',
          glow: 'rgba(255, 0, 127, 0.4)',
        },
        cyan: {
          DEFAULT: '#00f0ff',
          glow: 'rgba(0, 240, 255, 0.4)',
        },
        lime: {
          DEFAULT: '#39ff14',
        },
        purple: {
          DEFAULT: '#bf00ff',
        },
        background: {
          black: '#050505',
          dark: '#0a0a0a',
          card: '#111111',
          surface: '#1a1a1a',
        }
      },
      fontFamily: {
        heading: ['Syne', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        tech: ['Chakra Petch', 'sans-serif'],
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(253, 191, 21, 0.35)',
        'cyan-glow': '0 0 20px rgba(0, 240, 255, 0.35)',
        'pink-glow': '0 0 20px rgba(255, 0, 127, 0.35)',
      }
    },
  },
  plugins: [],
};
