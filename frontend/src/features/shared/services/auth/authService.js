// ==============================================================================
// AUTH SERVICE
// ==============================================================================

import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const AUTH_STORAGE_KEY = 'club_ideathon_auth_user';
const DEFAULT_ADMIN = {
  id: 'p_admin',
  email: 'lead@club.edu',
  role: 'admin',
  full_name: 'Lead Organizer (Me)',
  created_at: new Date().toISOString(),
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
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

  const login = async (role, identifier) => {
    let profile = null;

    const mockProfiles = {
      admin: DEFAULT_ADMIN,
      coordinator: {
        id: 'p_coord1',
        email: 'crd01@club.edu',
        role: 'coordinator',
        full_name: 'Ananya Sharma (Club Lead)',
        coordinator_id: 'crd_1',
        assigned_room: 'Room Alpha (Lab 101)',
        created_at: new Date().toISOString(),
      },
      judge: {
        id: 'p_judge1',
        email: 'jdg01@university.edu',
        role: 'judge',
        full_name: 'Dr. Ramesh Kumar',
        judge_id: 'jdg_1',
        created_at: new Date().toISOString(),
      },
      team: {
        id: 'p_team1',
        email: 'team_trk01@club.edu',
        role: 'team',
        full_name: 'NeuralPulse AI',
        team_id: 't_1',
        team_code: 'TRK-01',
        created_at: new Date().toISOString(),
      },
    };

    profile = mockProfiles[role] || null;

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

  const hasRole = (role) => {
    if (!user) return false;
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    return user.role === role;
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

export const tokenStorage = {
  getToken: () => localStorage.getItem('club_ideathon_auth_token'),
  setToken: (token) => localStorage.setItem('club_ideathon_auth_token', token),
  removeToken: () => localStorage.removeItem('club_ideathon_auth_token'),
};