// ==============================================================================
// VICEVERSE URL UTILITIES
// ==============================================================================

export function buildUrl(base: string, params: Record<string, unknown>): string {
  const url = new URL(base, window.location.origin);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      url.searchParams.append(key, String(value));
    }
  });
  return url.toString();
}

export function parseQueryString(query: string): Record<string, string> {
  const params = new URLSearchParams(query);
  const result: Record<string, string> = {};
  params.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}

export function getQueryParam(key: string, defaultValue = ''): string {
  if (typeof window === 'undefined') return defaultValue;
  const params = new URLSearchParams(window.location.search);
  return params.get(key) || defaultValue;
}

export function setQueryParam(key: string, value: string | null): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  if (value === null) {
    url.searchParams.delete(key);
  } else {
    url.searchParams.set(key, value);
  }
  window.history.replaceState({}, '', url.toString());
}

export function removeQueryParam(key: string): void {
  setQueryParam(key, null);
}

export function clearQueryParams(): void {
  if (typeof window === 'undefined') return;
  const url = new URL(window.location.href);
  url.search = '';
  window.history.replaceState({}, '', url.toString());
}

export function isExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function getDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return '';
  }
}

export function joinPaths(...paths: string[]): string {
  return paths
    .map((path, i) => {
      if (i === 0) return path.replace(/\/+$/, '');
      if (i === paths.length - 1) return path.replace(/^\/+/, '');
      return path.replace(/^\/+|\/+$/g, '');
    })
    .filter(Boolean)
    .join('/');
}

export function getPathname(): string {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname;
}

export function getHash(): string {
  if (typeof window === 'undefined') return '';
  return window.location.hash.slice(1);
}

export function setHash(hash: string): void {
  if (typeof window === 'undefined') return;
  window.location.hash = hash;
}