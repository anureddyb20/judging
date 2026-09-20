// ==============================================================================
// VICEVERSE ARRAY UTILITIES
// ==============================================================================

export function chunk<T>(array: T[], size: number): T[][] {
  if (size <= 0) return [];
  const result: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function flatten<T>(array: (T | T[])[]): T[] {
  return array.reduce((acc, val) => acc.concat(Array.isArray(val) ? flatten(val) : val), [] as T[]);
}

export function unique<T>(array: T[]): T[] {
  return [...new Set(array)];
}

export function uniqueBy<T>(array: T[], key: keyof T | ((item: T) => unknown)): T[] {
  const seen = new Set();
  return array.filter(item => {
    const value = typeof key === 'function' ? key(item) : item[key];
    if (seen.has(value)) return false;
    seen.add(value);
    return true;
  });
}

export function groupBy<T>(array: T[], key: keyof T | ((item: T) => string)): Record<string, T[]> {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    (groups[groupKey] = groups[groupKey] || []).push(item);
    return groups;
  }, {} as Record<string, T[]>);
}

export function sortBy<T>(array: T[], key: keyof T | ((item: T) => unknown), order: 'asc' | 'desc' = 'asc'): T[] {
  const getter = typeof key === 'function' ? key : (item: T) => item[key];
  return [...array].sort((a, b) => {
    const aVal = getter(a);
    const bVal = getter(b);
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
  const pass: T[] = [];
  const fail: T[] = [];
  array.forEach(item => (predicate(item) ? pass : fail).push(item));
  return [pass, fail];
}

export function difference<T>(array: T[], ...values: T[][]): T[] {
  const exclude = new Set(values.flat());
  return array.filter(item => !exclude.has(item));
}

export function intersection<T>(...arrays: T[][]): T[] {
  if (arrays.length === 0) return [];
  const sets = arrays.map(arr => new Set(arr));
  return arrays[0].filter(item => sets.every(set => set.has(item)));
}

export function union<T>(...arrays: T[][]): T[] {
  return [...new Set(arrays.flat())];
}

export function zip<T, U>(array1: T[], array2: U[]): [T, U][] {
  const length = Math.min(array1.length, array2.length);
  return Array.from({ length }, (_, i) => [array1[i], array2[i]]);
}

export function unzip<T, U>(array: [T, U][]): [T[], U[]] {
  return array.reduce(([first, second], [a, b]) => [[...first, a], [...second, b]], [[], []] as [T[], U[]]);
}

export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  return result;
}

export function sample<T>(array: T[], count = 1): T[] {
  const shuffled = shuffle(array);
  return shuffled.slice(0, count);
}

export function take<T>(array: T[], count: number): T[] {
  return array.slice(0, count);
}

export function drop<T>(array: T[], count: number): T[] {
  return array.slice(count);
}

export function compact<T>(array: (T | null | undefined | false | 0 | '')[]): T[] {
  return array.filter(Boolean) as T[];
}

export function flattenDeep<T>(array: unknown[]): T[] {
  return array.reduce((acc, val) => 
    Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), [] as T[]
  );
}

export function range(start: number, end?: number, step = 1): number[] {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  const result: number[] = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

export function findLast<T>(array: T[], predicate: (item: T) => boolean): T | undefined {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) return array[i];
  }
  return undefined;
}

export function findLastIndex<T>(array: T[], predicate: (item: T) => boolean): number {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i])) return i;
  }
  return -1;
}