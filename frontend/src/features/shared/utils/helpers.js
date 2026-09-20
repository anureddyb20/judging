// ==============================================================================
// UTILITY HELPERS
// ==============================================================================

import clsx from 'clsx';

export function cn(...inputs) {
  return clsx(inputs);
}

export function noop() {}

export function identity(value) {
  return value;
}

export function pipe(...fns) {
  return (value) => fns.reduce((acc, fn) => fn(acc), value);
}

export function compose(...fns) {
  return pipe(...fns.reverse());
}

export function debounce(fn, delay) {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

export function throttle(fn, limit) {
  let inThrottle = false;
  return (...args) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

export function generateId(prefix = '') {
  return `${prefix}${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export function range(start, end, step = 1) {
  if (end === undefined) {
    end = start;
    start = 0;
  }
  const result = [];
  for (let i = start; i < end; i += step) {
    result.push(i);
  }
  return result;
}

export function chunk(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}

export function unique(array) {
  return [...new Set(array)];
}

export function groupBy(array, key) {
  return array.reduce((groups, item) => {
    const groupKey = typeof key === 'function' ? key(item) : String(item[key]);
    if (!groups[groupKey]) groups[groupKey] = [];
    groups[groupKey].push(item);
    return groups;
  }, {});
}

export function sortBy(array, key, order = 'asc') {
  const getter = typeof key === 'function' ? key : (item) => item[key];
  return [...array].sort((a, b) => {
    const aVal = getter(a);
    const bVal = getter(b);
    if (aVal < bVal) return order === 'asc' ? -1 : 1;
    if (aVal > bVal) return order === 'asc' ? 1 : -1;
    return 0;
  });
}

export function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
}

export function pick(obj, keys) {
  const result = {};
  keys.forEach(key => {
    if (key in obj) result[key] = obj[key];
  });
  return result;
}

export function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

export function isEmpty(value) {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
}

export function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export function retry(fn, retries = 3, delay = 1000) {
  return fn().catch(err => {
    if (retries <= 0) throw err;
    return sleep(delay).then(() => retry(fn, retries - 1, delay * 2));
  });
}