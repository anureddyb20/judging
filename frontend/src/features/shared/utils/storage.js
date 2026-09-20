// ==============================================================================
// VICEVERSE STORAGE UTILITIES (localStorage/sessionStorage helpers)
// ==============================================================================

const STORAGE_PREFIX = 'viceverse_';

function getKey(key: string): string {
  return `${STORAGE_PREFIX}${key}`;
}

function isStorageAvailable(type: 'localStorage' | 'sessionStorage'): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const storage = window[type];
    const test = '__storage_test__';
    storage.setItem(test, test);
    storage.removeItem(test);
    return true;
  } catch {
    return false;
  }
}

export const localStorageUtil = {
  isAvailable: isStorageAvailable('localStorage'),
  
  get<T>(key: string, fallback?: T): T | undefined {
    if (!this.isAvailable) return fallback;
    try {
      const item = localStorage.getItem(getKey(key));
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  
  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable) return false;
    try {
      localStorage.setItem(getKey(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove(key: string): boolean {
    if (!this.isAvailable) return false;
    try {
      localStorage.removeItem(getKey(key));
      return true;
    } catch {
      return false;
    }
  },
  
  clear(): boolean {
    if (!this.isAvailable) return false;
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
    } catch {
      return false;
    }
  },
  
  keys(): string[] {
    if (!this.isAvailable) return [];
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_PREFIX)) {
        keys.push(key.slice(STORAGE_PREFIX.length));
      }
    }
    return keys;
  },
};

export const sessionStorageUtil = {
  isAvailable: isStorageAvailable('sessionStorage'),
  
  get<T>(key: string, fallback?: T): T | undefined {
    if (!this.isAvailable) return fallback;
    try {
      const item = sessionStorage.getItem(getKey(key));
      return item ? JSON.parse(item) : fallback;
    } catch {
      return fallback;
    }
  },
  
  set<T>(key: string, value: T): boolean {
    if (!this.isAvailable) return false;
    try {
      sessionStorage.setItem(getKey(key), JSON.stringify(value));
      return true;
    } catch {
      return false;
    }
  },
  
  remove(key: string): boolean {
    if (!this.isAvailable) return false;
    try {
      sessionStorage.removeItem(getKey(key));
      return true;
    } catch {
      return false;
    }
  },
  
  clear(): boolean {
    if (!this.isAvailable) return false;
    try {
      const keysToRemove: string[] = [];
      for (let i = 0; i < sessionStorage.length; i++) {
        const key = sessionStorage.key(i);
        if (key?.startsWith(STORAGE_PREFIX)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => sessionStorage.removeItem(key));
      return true;
    } catch {
      return false;
    }
  },
};

export function createPersistedState<T>(
  key: string,
  initialValue: T,
  storage: 'local' | 'session' = 'local'
): [T, (value: T | ((prev: T) => T)) => void] {
  const store = storage === 'local' ? localStorageUtil : sessionStorageUtil;
  
  const getInitial = (): T => {
    if (typeof window === 'undefined') return initialValue;
    return store.get(key, initialValue);
  };
  
  // This would be used with useState in a hook
  // Included here for reference - actual hook is in features/shared/hooks/useLocalStorage
  return [getInitial(), (value: T | ((prev: T) => T)) => {
    const newValue = typeof value === 'function' ? (value as (prev: T) => T)(getInitial()) : value;
    store.set(key, newValue);
  }];
}

export const storageKeys = {
  authUser: 'auth_user',
  appState: 'app_state',
  theme: 'theme',
  preferences: 'preferences',
  recentTeams: 'recent_teams',
  recentJudges: 'recent_judges',
  draftEvaluations: 'draft_evaluations',
  sidebarState: 'sidebar_state',
  tableColumns: 'table_columns',
} as const;