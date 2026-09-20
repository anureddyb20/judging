// ==============================================================================
// VICEVERSE NUMBER UTILITIES
// ==============================================================================

export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function floor(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.floor(value * factor) / factor;
}

export function ceil(value: number, decimals = 0): number {
  const factor = 10 ** decimals;
  return Math.ceil(value * factor) / factor;
}

export function formatNumber(value: number, options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatCurrency(value: number, currency = 'USD', options: Intl.NumberFormatOptions = {}): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function lerp(start: number, end: number, factor: number): number {
  return start + (end - start) * clamp(factor, 0, 1);
}

export function mapRange(
  value: number,
  inMin: number,
  inMax: number,
  outMin: number,
  outMax: number
): number {
  return outMin + ((value - inMin) * (outMax - outMin)) / (inMax - inMin);
}

export function random(min: number, max: number, integer = false): number {
  const value = Math.random() * (max - min) + min;
  return integer ? Math.floor(value) : value;
}

export function sum(numbers: number[]): number {
  return numbers.reduce((acc, n) => acc + n, 0);
}

export function average(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  return sum(numbers) / numbers.length;
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? (sorted[mid - 1] + sorted[mid]) / 2
    : sorted[mid];
}

export function min(numbers: number[]): number {
  return numbers.length === 0 ? 0 : Math.min(...numbers);
}

export function max(numbers: number[]): number {
  return numbers.length === 0 ? 0 : Math.max(...numbers);
}

export function percentile(numbers: number[], p: number): number {
  if (numbers.length === 0) return 0;
  const sorted = [...numbers].sort((a, b) => a - b);
  const index = Math.ceil(p / 100 * sorted.length) - 1;
  return sorted[clamp(index, 0, sorted.length - 1)];
}

export function standardDeviation(numbers: number[]): number {
  if (numbers.length === 0) return 0;
  const avg = average(numbers);
  const squareDiffs = numbers.map(n => Math.pow(n - avg, 2));
  return Math.sqrt(average(squareDiffs));
}

export function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = Math.floor(ms / 1000);
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ${seconds % 60}s`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ${minutes % 60}m`;
}

export function parseNumber(value: string | number, fallback = 0): number {
  if (typeof value === 'number') return isNaN(value) ? fallback : value;
  const parsed = Number(value);
  return isNaN(parsed) ? fallback : parsed;
}