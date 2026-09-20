// ==============================================================================
// VICEVERSE DATE UTILITIES
// ==============================================================================

export function formatTimeRemaining(targetDate: string | Date | null): {
  hours: string;
  minutes: string;
  seconds: string;
  expired: boolean;
} {
  if (!targetDate) return { hours: '00', minutes: '00', seconds: '00', expired: true };
  
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff <= 0) {
    return { hours: '00', minutes: '00', seconds: '00', expired: true };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return {
    hours: String(hours).padStart(2, '0'),
    minutes: String(minutes).padStart(2, '0'),
    seconds: String(seconds).padStart(2, '0'),
    expired: false,
  };
}

export function formatDate(dateString: string | Date | null, options?: Intl.DateTimeFormatOptions): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    ...options,
  };
  return date.toLocaleDateString([], defaultOptions);
}

export function formatDateTime(dateString: string | Date | null): string {
  if (!dateString) return 'N/A';
  const date = new Date(dateString);
  return date.toLocaleString([], {
    hour: '2-digit',
    minute: '2-digit',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatRelativeTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatDate(date);
}

export function isExpired(dateString: string | Date | null): boolean {
  if (!dateString) return true;
  return new Date(dateString).getTime() <= Date.now();
}

export function addTime(date: Date, amount: number, unit: 'ms' | 's' | 'm' | 'h' | 'd'): Date {
  const multipliers = { ms: 1, s: 1000, m: 60000, h: 3600000, d: 86400000 };
  return new Date(date.getTime() + amount * multipliers[unit]);
}

export function startOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

export function endOfDay(date: Date): Date {
  const result = new Date(date);
  result.setHours(23, 59, 59, 999);
  return result;
}

export function isSameDay(date1: Date, date2: Date): boolean {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
}

export function parseISODate(dateString: string): Date | null {
  try {
    return new Date(dateString);
  } catch {
    return null;
  }
}