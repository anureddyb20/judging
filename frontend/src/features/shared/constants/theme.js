// ==============================================================================
// VICEVERSE THEME CONFIGURATION
// ==============================================================================

export const THEME = {
  colors: {
    primary: '#fdbf15',      // Gold/Yellow
    secondary: '#ff007f',    // Pink/Magenta
    accent: '#ff007f',       // Pink accent
    cyan: '#00f0ff',         // Cyan
    lime: '#39ff14',         // Lime Green
    gold: '#fdbf15',         // Gold
    orange: '#ff5e00',       // Orange
    purple: '#bf00ff',       // Purple
    
    // Semantic colors
    success: '#39ff14',
    warning: '#fdbf15',
    error: '#ff007f',
    info: '#00f0ff',
    
    // Backgrounds
    bg: {
      primary: '#050505',
      secondary: '#0a0a0a',
      tertiary: '#111111',
      card: '#0d0d0d',
      elevated: '#1a1a1a',
    },
    
    // Borders
    border: {
      primary: '#fdbf15',
      secondary: '#2a2a2a',
      gold: '#fdbf15',
      cyan: '#00f0ff',
      pink: '#ff007f',
      subtle: '#1a1a1a',
    },
    
    // Text
    text: {
      primary: '#ffffff',
      secondary: '#a1a1aa',     // zinc-400
      muted: '#71717a',         // zinc-500
      disabled: '#3f3f46',      // zinc-600
      inverse: '#050505',
    },
  },
  
  fonts: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
    heading: ['Space Grotesk', 'Inter', 'system-ui', 'sans-serif'],
  },
  
  fontSizes: {
    xs: '0.625rem',    // 10px
    sm: '0.75rem',     // 12px
    base: '0.875rem',  // 14px
    lg: '1rem',        // 16px
    xl: '1.125rem',    // 18px
    '2xl': '1.25rem',  // 20px
    '3xl': '1.5rem',   // 24px
    '4xl': '2rem',     // 32px
    '5xl': '3rem',     // 48px
    '6xl': '4rem',     // 64px
  },
  
  spacing: {
    0: '0',
    1: '0.25rem',   // 4px
    2: '0.5rem',    // 8px
    3: '0.75rem',   // 12px
    4: '1rem',      // 16px
    5: '1.25rem',   // 20px
    6: '1.5rem',    // 24px
    8: '2rem',      // 32px
    10: '2.5rem',   // 40px
    12: '3rem',     // 48px
    16: '4rem',     // 64px
    20: '5rem',     // 80px
    24: '6rem',     // 96px
  },
  
  borderRadius: {
    none: '0',
    sm: '0.25rem',
    md: '0.375rem',
    lg: '0.5rem',
    xl: '0.75rem',
    '2xl': '1rem',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    glow: '0 0 20px rgba(253, 191, 21, 0.3)',
    glowCyan: '0 0 20px rgba(0, 240, 255, 0.3)',
    glowPink: '0 0 20px rgba(255, 0, 127, 0.3)',
  },
  
  transitions: {
    fast: '150ms ease',
    normal: '250ms ease',
    slow: '350ms ease',
  },
  
  zIndex: {
    hide: -1,
    base: 0,
    dropdown: 1000,
    sticky: 1100,
    modal: 1300,
    popover: 1400,
    toast: 1500,
    tooltip: 1600,
  },
  
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
} as const;

export type Theme = typeof THEME;
export type ColorScale = keyof typeof THEME.colors;
export type FontFamily = keyof typeof THEME.fonts;