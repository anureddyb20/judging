// ==============================================================================
// VICEVERSE STRING UTILITIES
// ==============================================================================

export function truncate(str: string, length: number, suffix = '...'): string {
  if (str.length <= length) return str;
  return str.slice(0, length - suffix.length) + suffix;
}

export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function capitalizeWords(str: string): string {
  return str.replace(/\b\w/g, char => char.toUpperCase());
}

export function camelToKebab(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export function kebabToCamel(str: string): string {
  return str.replace(/-([a-z])/g, (_, char) => char.toUpperCase());
}

export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, char) => char.toUpperCase());
}

export function camelToSnake(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, '');
}

export function escapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    "'": '&#039;',
  };
  return str.replace(/[&<>"']/g, char => map[char]);
}

export function unescapeHtml(str: string): string {
  const map: Record<string, string> = {
    '&': '&',
    '<': '<',
    '>': '>',
    '"': '"',
    '&#039;': "'",
  };
  return str.replace(/&|<|>|"|&#039;/g, match => map[match]);
}

export function padStart(str: string, length: number, char = ' '): string {
  return String(str).padStart(length, char);
}

export function padEnd(str: string, length: number, char = ' '): string {
  return String(str).padEnd(length, char);
}

export function countWords(str: string): number {
  return str.trim().split(/\s+/).filter(Boolean).length;
}

export function countChars(str: string, includeSpaces = true): number {
  return includeSpaces ? str.length : str.replace(/\s/g, '').length;
}

export function randomString(length: number, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export function maskString(str: string, visibleStart = 4, visibleEnd = 4, maskChar = '*'): string {
  if (str.length <= visibleStart + visibleEnd) return str;
  const start = str.slice(0, visibleStart);
  const end = str.slice(-visibleEnd);
  const middle = maskChar.repeat(str.length - visibleStart - visibleEnd);
  return start + middle + end;
}