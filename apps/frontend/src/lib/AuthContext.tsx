'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'CLIENT' | 'ADMIN';
  phone?: string | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || '/api/v1';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        if (!token) {
          setIsLoading(false);
          return;
        }

        const payload = parseJwt(token);
        if (payload) {
          if (payload.exp && payload.exp * 1000 <= Date.now() + 60 * 1000) {
            const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
              method: 'POST',
              credentials: 'include',
            });
            const refreshedData = refreshResponse.ok ? await refreshResponse.json() : null;
            if (refreshedData?.accessToken) {
              localStorage.setItem('accessToken', refreshedData.accessToken);
              const refreshedPayload = parseJwt(refreshedData.accessToken);
              if (refreshedPayload) {
                setUser({
                  id: refreshedPayload.sub,
                  email: refreshedPayload.email,
                  name: refreshedPayload.name || 'Usuário',
                  role: refreshedPayload.role || 'CLIENT',
                  phone: refreshedPayload.phone || null,
                });
                return;
              }
            }
          }
          setUser({
            id: payload.sub,
            email: payload.email,
            name: payload.name || 'Usuário',
            role: payload.role || 'CLIENT',
            phone: payload.phone || null,
          });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('accessToken');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    const renewSession = async () => {
      try {
        const response = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        if (!response.ok) return;

        const data = await response.json();
        if (data.accessToken) {
          localStorage.setItem('accessToken', data.accessToken);
        }
      } catch {
        // A transient network failure should not log the user out.
      }
    };

    const interval = window.setInterval(renewSession, 10 * 60 * 1000);
    window.addEventListener('focus', renewSession);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', renewSession);
    };
  }, [user]);

  const login = async (email: string, password: string) => {
    const response = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao fazer login' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.accessToken) {
      throw new Error('Resposta inválida do servidor');
    }

    localStorage.setItem('accessToken', data.accessToken);
    const loggedUser: User = {
      id: data.user.id,
      email: data.user.email,
      name: data.user.name || 'Usuário',
      role: data.user.role || 'CLIENT',
      phone: data.user.phone || null,
    };
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    const response = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password, phone }),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Erro ao registrar' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!data.accessToken) {
      throw new Error('Resposta inválida do servidor');
    }

    localStorage.setItem('accessToken', data.accessToken);
    setUser({
      id: data.user.id,
      email: data.user.email,
      name: data.user.name || name,
      role: data.user.role || 'CLIENT',
      phone: data.user.phone || phone || null,
    });
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          credentials: 'include',
        }).catch(() => {
          // Ignore logout API errors
        });
      }
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        setUser(null);
        return;
      }

      const payload = parseJwt(token);
      if (payload) {
        setUser({
          id: payload.sub,
          email: payload.email,
          name: payload.name || 'Usuário',
          role: payload.role || 'CLIENT',
          phone: payload.phone || null,
        });
      }
    } catch (error) {
      console.error('Refresh auth failed:', error);
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

  const updateUser = (updates: Partial<User>) => {
    setUser((currentUser) => currentUser ? { ...currentUser, ...updates } : currentUser);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, isAuthenticated: !!user, login, register, logout, refreshAuth, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}

function parseJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}
