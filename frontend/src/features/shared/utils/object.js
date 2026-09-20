// ==============================================================================
// VICEVERSE OBJECT UTILITIES
// ==============================================================================

export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

export function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    
    if (
      sourceValue !== null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }
  return result;
}

export function isEmpty(value: unknown): boolean {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function hasKey(obj: unknown, key: string): boolean {
  return obj !== null && typeof obj === 'object' && key in obj;
}

export function getPath<T>(obj: unknown, path: string, defaultValue?: T): T | undefined {
  const keys = path.split('.');
  let current: unknown = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return defaultValue;
    }
    current = (current as Record<string, unknown>)[key];
  }
  
  return current as T ?? defaultValue;
}

export function setPath<T extends Record<string, unknown>>(obj: T, path: string, value: unknown): T {
  const result = deepClone(obj);
  const keys = path.split('.');
  let current: Record<string, unknown> = result;
  
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = {};
    }
    current = current[key] as Record<string, unknown>;
  }
  
  current[keys[keys.length - 1]] = value;
  return result;
}

export function invert<T extends Record<string, string>>(obj: T): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[value] = key;
  }
  return result;
}

export function renameKeys<T extends Record<string, unknown>>(
  obj: T,
  keyMap: Record<string, string>
): T {
  const result = { ...obj };
  for (const [oldKey, newKey] of Object.entries(keyMap)) {
    if (oldKey in result) {
      result[newKey] = result[oldKey];
      delete result[oldKey];
    }
  }
  return result;
}

export function mapKeys<T extends Record<string, unknown>, U>(
  obj: T,
  mapper: (key: string, value: T[keyof T]) => U
): Record<string, U> {
  const result: Record<string, U> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = mapper(key, value);
  }
  return result;
}

export function mapValues<T extends Record<string, unknown>, U>(
  obj: T,
  mapper: (value: T[keyof T], key: string) => U
): Record<keyof T, U> {
  const result: Record<string, U> = {};
  for (const [key, value] of Object.entries(obj)) {
    result[key] = mapper(value, key);
  }
  return result as Record<keyof T, U>;
}

export function filterKeys<T extends Record<string, unknown>>(
  obj: T,
  predicate: (key: string, value: T[keyof T]) => boolean
): Partial<T> {
  const result: Partial<T> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (predicate(key, value)) {
      result[key] = value;
    }
  }
  return result;
}

export function objectEquals<T>(a: T, b: T): boolean {
  return JSON.stringify(a) === JSON.stringify(b);
}

export function keysOf<T extends Record<string, unknown>>(obj: T): (keyof T)[] {
  return Object.keys(obj) as (keyof T)[];
}

export function valuesOf<T extends Record<string, unknown>>(obj: T): T[keyof T][] {
  return Object.values(obj);
}

export function entriesOf<T extends Record<string, unknown>>(obj: T): [keyof T, T[keyof T]][] {
  return Object.entries(obj) as [keyof T, T[keyof T]][];
}