import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (identifier: string, pass: string) => Promise<boolean>;
  logout: () => void;
  selectedMineId: string;
  setSelectedMineId: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = typeof localStorage !== 'undefined' ? localStorage.getItem('minemind_user') : null;
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    try {
      return typeof localStorage !== 'undefined' ? localStorage.getItem('minemind_token') : null;
    } catch {
      return null;
    }
  });
  const [selectedMineId, setSelectedMineId] = useState<string>(() => {
    try {
      return typeof localStorage !== 'undefined' ? (localStorage.getItem('minemind_mine_id') || 'mine-00000000-0000-0000-0000-000000000001') : 'mine-00000000-0000-0000-0000-000000000001';
    } catch {
      return 'mine-00000000-0000-0000-0000-000000000001';
    }
  });

  useEffect(() => {
    if (selectedMineId && typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('minemind_mine_id', selectedMineId);
      } catch {}
    }
  }, [selectedMineId]);

  const login = async (identifier: string, pass: string): Promise<boolean> => {
    try {
      const resp = await api.login(identifier, pass);
      setUser(resp.user);
      setToken(resp.accessToken);
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('minemind_user', JSON.stringify(resp.user));
        localStorage.setItem('minemind_token', resp.accessToken);
      }
      return true;
    } catch (e) {
      console.error("Login error", e);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem('minemind_user');
      localStorage.removeItem('minemind_token');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      token,
      isAuthenticated: !!user,
      login,
      logout,
      selectedMineId,
      setSelectedMineId
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
