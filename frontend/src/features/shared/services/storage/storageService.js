// ==============================================================================
// STORAGE SERVICE (localStorage wrapper with validation)
// ==============================================================================

import { useState } from 'react';

const STORAGE_PREFIX = 'club_ideathon_';

const defaultOptions = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  version: 1,
};

function getKey(key) {
  return `${STORAGE_PREFIX}${key}`;
}

function migrateData(key, data, currentVersion) {
  return data;
}

export const storageService = {
  get(key, fallback, options = {}) {
    if (typeof window === 'undefined') return fallback;
    
    const opts = { ...defaultOptions, ...options };
    const fullKey = getKey(key);
    
    try {
      const item = localStorage.getItem(fullKey);
      if (item === null) return fallback;
      
      const parsed = opts.deserialize(item);
      return migrateData(key, parsed, opts.version || 1);
    } catch (error) {
      console.warn(`Storage read error for key "${key}":`, error);
      return fallback;
    }
  },

  set(key, value, options = {}) {
    if (typeof window === 'undefined') return false;
    
    const opts = { ...defaultOptions, ...options };
    const fullKey = getKey(key);
    
    try {
      const serialized = opts.serialize({
        data: value,
        version: opts.version || 1,
        timestamp: Date.now(),
      });
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.warn(`Storage write error for key "${key}":`, error);
      return false;
    }
  },

  remove(key) {
    if (typeof window === 'undefined') return false;
    try {
      localStorage.removeItem(getKey(key));
      return true;
    } catch {
      return false;
    }
  },

  clear() {
    if (typeof window === 'undefined') return;
    try {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(k => localStorage.removeItem(k));
    } catch (error) {
      console.warn('Storage clear error:', error);
    }
  },

  keys() {
    if (typeof window === 'undefined') return [];
    const keys = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(STORAGE_PREFIX)) {
        keys.push(key.replace(STORAGE_PREFIX, ''));
      }
    }
    return keys;
  },

  has(key) {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(getKey(key)) !== null;
  },
};

export function useLocalStorage(key, initialValue, options = {}) {
  const [storedValue, setStoredValue] = useState(() => {
    return storageService.get(key, initialValue, options);
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageService.set(key, valueToStore, options);
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  const removeValue = () => {
    try {
      storageService.remove(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.warn(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
}