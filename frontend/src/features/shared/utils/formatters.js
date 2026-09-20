// ==============================================================================
// VICEVERSE FORMATTER UTILITIES
// ==============================================================================

export function formatScore(score: number, maxScore = 100): string {
  return `${Math.min(Math.max(score, 0), maxScore).toFixed(1)} / ${maxScore}`;
}

export function formatPercentage(value: number, decimals = 1): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

export function formatRank(rank: number | string): string {
  if (rank === '-' || rank === '' || rank === null || rank === undefined) return '-';
  const num = Number(rank);
  if (isNaN(num)) return String(rank);
  return `#${num}`;
}

export function formatTeamCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function formatJudgeCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function formatMissionCode(code: string): string {
  return code.toUpperCase().replace(/[^A-Z0-9-]/g, '');
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
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

export function formatTimestamp(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const d = new Date(date);
  return d.toLocaleString(undefined, {
    dateStyle: 'short',
    timeStyle: 'short',
    ...options,
  });
}

export function formatRelative(date: string | Date): string {
  const d = new Date(date);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return formatTimestamp(d);
}

export function formatPhone(phone: string): string {
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`;
  }
  return phone;
}

export function formatCreditCard(card: string): string {
  const cleaned = card.replace(/\D/g, '');
  return cleaned.replace(/(.{4})/g, '$1 ').trim();
}

export function formatInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .map(part => part[0].toUpperCase())
    .slice(0, 2)
    .join('');
}

export function formatStatus(status: string): string {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

export function formatPriority(priority: string): string {
  const map: Record<string, string> = {
    info: 'INFO',
    warning: 'WARNING',
    urgent: 'URGENT',
    success: 'SUCCESS',
  };
  return map[priority.toLowerCase()] || priority.toUpperCase();
}