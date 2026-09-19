// ==============================================================================
// VICEVERSE AUTH SERVICE
// ==============================================================================

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import type { Profile, UserRole } from '@/features/shared/types';

interface AuthContextType {
  user: Profile | null;
  loading: boolean;
  login: (role: UserRole, identifier?: string) => Promise<Profile | null>;
  logout: () => void;
  hasRole: (role: UserRole | UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AUTH_STORAGE_KEY = 'viceverse_auth_user';
const DEFAULT_ADMIN: Profile = {
  id: 'p_admin',
  email: 'admin@viceverse.com',
  role: 'admin',
  full_name: 'COMMANDER VEX',
  avatar_url: '/assets/avatars/admin.png',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setLoading(false);
  }, []);

  const login = async (role: UserRole, identifier?: string): Promise<Profile | null> => {
    // In production, this would call Supabase Auth or your auth provider
    // For now, mock login based on role and identifier
    let profile: Profile | null = null;

    const mockProfiles: Record<string, Profile> = {
      admin: DEFAULT_ADMIN,
      judge: {
        id: 'p_judge1',
        email: 'judge1@viceverse.com',
        role: 'judge',
        full_name: 'DR. ELENA ROSTOVA',
        avatar_url: '/assets/avatars/judge1.png',
        created_at: new Date().toISOString(),
      },
      team: {
        id: 'p_team14',
        email: 'team14@viceverse.com',
        role: 'team',
        full_name: 'SYNTHETIC VANGUARD',
        team_code: 'VV-014',
        team_id: 't14',
        created_at: new Date().toISOString(),
      },
      coordinator: {
        id: 'p_coordinator',
        email: 'coordinator@viceverse.com',
        role: 'coordinator',
        full_name: 'CLUB COORDINATOR',
        created_at: new Date().toISOString(),
      },
    };

    profile = mockProfiles[role] || mockProfiles.team;
    
    if (identifier && role === 'judge') {
      // Could look up specific judge
    }
    if (identifier && role === 'team') {
      // Could look up specific team
    }

    if (profile) {
      setUser(profile);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
    }

    return profile;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const hasRole = (role: UserRole | UserRole[]): boolean => {
    if (!user) return false;
    const roles = Array.isArray(role) ? role : [role];
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export const authService = {
  getCurrentUser: () => {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  },
  isAuthenticated: () => !!localStorage.getItem(AUTH_STORAGE_KEY),
  getToken: () => localStorage.getItem('viceverse_auth_token'),
  setToken: (token: string) => localStorage.setItem('viceverse_auth_token', token),
  clearToken: () => localStorage.removeItem('viceverse_auth_token'),
};