// ==============================================================================
// VICEVERSE STORAGE SERVICE (localStorage wrapper with validation)
// ==============================================================================

import { useState } from 'react';

const STORAGE_PREFIX = 'viceverse_';

interface StorageOptions {
  serialize?: (value: unknown) => string;
  deserialize?: (value: string) => unknown;
  version?: number;
}

const defaultOptions: StorageOptions = {
  serialize: JSON.stringify,
  deserialize: JSON.parse,
  version: 1,
};

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function migrateData<T>(key: string, data: T, currentVersion: number): T {
  // Add migration logic here when version changes
  return data;
}

export const storageService = {
  get<T>(key: string, fallback?: T, options: StorageOptions = {}): T | undefined {
    if (typeof window === 'undefined') return fallback;
    
    const opts = { ...defaultOptions, ...options };
    const fullKey = getKey(key);
    
    try {
      const item = localStorage.getItem(fullKey);
      if (item === null) return fallback;
      
      const parsed = opts.deserialize!(item);
      return migrateData(key, parsed, opts.version || 1);
    } catch (error) {
      console.warn(`Storage read error for key "${key}":`, error);
      return fallback;
    }
  },

  set<T>(key: string, value: T, options: StorageOptions = {}): boolean {
    if (typeof window === 'undefined') return false;
    
    const opts = { ...defaultOptions, ...options };
    const fullKey = getKey(key);
    
    try {
      const serialized = opts.serialize!({
        data: value,
        version: opts.version || 1,
        timestamp: Date.now(),
      });
      localStorage.setItem(fullKey, serialized);
      return true;
    } catch (error) {
      console.error(`Storage write error for key "${key}":`, error);
      return false;
    }
  },

  remove(key: string): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      localStorage.removeItem(getKey(key));
      return true;
    } catch (error) {
      console.warn(`Storage remove error for key "${key}":`, error);
      return false;
    }
  },

  clear(): boolean {
    if (typeof window === 'undefined') return false;
    
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Storage clear error:', error);
      return false;
    }
  },

  getAllKeys(): string[] {
    if (typeof window === 'undefined') return [];
    
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key.slice(STORAGE_PREFIX.length));
      }
    }
    return keys;
  },

  // Specialized methods for app data
  getAuthUser(): ReturnType<typeof this.get> {
    return this.get('auth_user');
  },

  setAuthUser(user: unknown): boolean {
    return this.set('auth_user', user);
  },

  clearAuthUser(): boolean {
    return this.remove('auth_user');
  },

  getAppState(): ReturnType<typeof this.get> {
    return this.get('app_state');
  },

  setAppState(state: unknown): boolean {
    return this.set('app_state', state);
  },
};

// React hook for reactive localStorage
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    return storageService.get(key, initialValue);
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      storageService.set(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue] as const;
}