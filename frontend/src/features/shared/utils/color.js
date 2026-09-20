// ==============================================================================
// VICEVERSE COLOR UTILITIES
// ==============================================================================

export const MISSION_COLORS: Record<string, string> = {
  'MSN-AI': '#fdbf15',
  'MSN-SEC': '#ff007f',
  'MSN-CV': '#00f0ff',
  'MSN-ROB': '#39ff14',
  'MSN-IOT': '#ff5e00',
  'MSN-VLSI': '#bf00ff',
};

export const RANK_COLORS: Record<number, string> = {
  1: '#fdbf15', // Gold
  2: '#e5e7eb', // Silver
  3: '#cd7f32', // Bronze
};

export const STATUS_COLORS: Record<string, string> = {
  active: '#39ff14',
  pending: '#fdbf15',
  completed: '#00f0ff',
  draft: '#ff5e00',
  disqualified: '#ff007f',
  archived: '#6b7280',
  submitted: '#00f0ff',
  locked: '#ff007f',
  info: '#00f0ff',
  warning: '#fdbf15',
  urgent: '#ff007f',
  success: '#39ff14',
  important: '#ff5e00',
};

export const PRIORITY_COLORS: Record<string, string> = {
  info: '#00f0ff',
  warning: '#fdbf15',
  urgent: '#ff007f',
  success: '#39ff14',
};

export function getMissionColor(code: string): string {
  return MISSION_COLORS[code] || '#fdbf15';
}

export function getRankColor(rank: number): string {
  return RANK_COLORS[rank] || '#4b5563';
}

export function getStatusColor(status: string): string {
  return STATUS_COLORS[status.toLowerCase()] || '#6b7280';
}

export function getPriorityColor(priority: string): string {
  return PRIORITY_COLORS[priority.toLowerCase()] || '#6b7280';
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const clean = hex.replace('#', '');
  if (clean.length !== 3 && clean.length !== 6) return null;
  
  const expanded = clean.length === 3
    ? clean.split('').map(c => c + c).join('')
    : clean;
  
  const num = parseInt(expanded, 16);
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  };
}

export function rgbToHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
}

export function hexToHsl(hex: string): { h: number; s: number; l: number } | null {
  const rgb = hexToRgb(hex);
  if (!rgb) return null;
  
  const { r, g, b } = rgb;
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case rNorm: h = (gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0); break;
      case gNorm: h = (bNorm - rNorm) / d + 2; break;
      case bNorm: h = (rNorm - gNorm) / d + 4; break;
    }
    h /= 6;
  }
  
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

export function lighten(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const factor = percent / 100;
  const newR = Math.round(r + (255 - r) * factor);
  const newG = Math.round(g + (255 - g) * factor);
  const newB = Math.round(b + (255 - b) * factor);
  
  return rgbToHex(newR, newG, newB);
}

export function darken(hex: string, percent: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const { r, g, b } = rgb;
  const factor = percent / 100;
  const newR = Math.round(r * (1 - factor));
  const newG = Math.round(g * (1 - factor));
  const newB = Math.round(b * (1 - factor));
  
  return rgbToHex(newR, newG, newB);
}

export function withAlpha(hex: string, alpha: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`;
}

export function contrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return '#000000';
  
  const { r, g, b } = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? '#000000' : '#ffffff';
}

export function generateColorPalette(baseColor: string, count = 5): string[] {
  const hsl = hexToHsl(baseColor);
  if (!hsl) return Array(count).fill(baseColor);
  
  const { h, s, l } = hsl;
  const step = 360 / count;
  
  return Array.from({ length: count }, (_, i) => {
    const newH = (h + i * step) % 360;
    return hslToHex(newH, s, l);
  });
}

function hslToHex(h: number, s: number, l: number): string {
  const hNorm = h / 360;
  const sNorm = s / 100;
  const lNorm = l / 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  if (sNorm === 0) {
    r = g = b = lNorm;
  } else {
    const q = lNorm < 0.5 ? lNorm * (1 + sNorm) : lNorm + sNorm - lNorm * sNorm;
    const p = 2 * lNorm - q;
    r = hue2rgb(p, q, hNorm + 1/3);
    g = hue2rgb(p, q, hNorm);
    b = hue2rgb(p, q, hNorm - 1/3);
  }
  
  return rgbToHex(Math.round(r * 255), Math.round(g * 255), Math.round(b * 255));
}