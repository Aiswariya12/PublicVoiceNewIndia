import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginApi, registerApi, getMeApi } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // First visit is logged out so Login page is shown first
  const [token, setToken] = useState(() => localStorage.getItem('pvi_token') || null);
  const [user, setUser] = useState(() => {
    const savedToken = localStorage.getItem('pvi_token');
    if (!savedToken) return null;
    const role = localStorage.getItem('pvi_active_role') || 'CITIZEN';
    const email = localStorage.getItem('pvi_user_email') || 'citizen@newindia.gov.in';
    const name = localStorage.getItem('pvi_user_name') || 'Dr. Ashis Kumar';
    return {
      id: 101,
      fullName: name,
      email: email,
      role: role,
      createdAt: '2026-01-15T10:00:00',
    };
  });
  const [isLoading, setIsLoading] = useState(false);

  // Sync profile if token is present
  useEffect(() => {
    if (token) {
      getMeApi()
        .then((profile) => {
          if (profile && profile.email) {
            setUser((prev) => ({ ...prev, ...profile }));
          }
        })
        .catch(() => {
          // Keep existing user if offline
        });
    }
  }, [token]);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const res = await loginApi({ email, password });
      if (res.token) {
        setToken(res.token);
        localStorage.setItem('pvi_token', res.token);
        localStorage.setItem('pvi_user_email', email);
        const nameGuess = email.split('@')[0].replace(/[._]/g, ' ');
        const formattedName = nameGuess.charAt(0).toUpperCase() + nameGuess.slice(1);
        localStorage.setItem('pvi_user_name', formattedName);
        setUser({
          id: 101,
          email,
          fullName: formattedName,
          role: localStorage.getItem('pvi_active_role') || 'CITIZEN',
          createdAt: new Date().toISOString(),
        });
        return { success: true };
      }
      return { success: false, error: 'No token returned' };
    } catch (err) {
      return { success: false, error: err.message || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (fullName, email, password) => {
    setIsLoading(true);
    try {
      const res = await registerApi({ fullName, email, password });
      if (res.token) {
        setToken(res.token);
        localStorage.setItem('pvi_token', res.token);
        localStorage.setItem('pvi_user_email', email);
        localStorage.setItem('pvi_user_name', fullName);
        setUser({
          id: Date.now(),
          fullName,
          email,
          role: 'CITIZEN',
          createdAt: new Date().toISOString(),
        });
        return { success: true };
      }
      return { success: false, error: 'No token returned' };
    } catch (err) {
      return { success: false, error: err.message || 'Registration failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithDemo = (role, email, name) => {
    const fakeToken = btoa(JSON.stringify({ sub: email, role, exp: Date.now() + 86400000 }));
    const tokenStr = `eyJhbGciOiJIUzI1NiJ9.${fakeToken}.mockSignature`;
    setToken(tokenStr);
    localStorage.setItem('pvi_token', tokenStr);
    localStorage.setItem('pvi_active_role', role);
    localStorage.setItem('pvi_user_email', email);
    localStorage.setItem('pvi_user_name', name);
    setUser({
      id: Date.now(),
      fullName: name,
      email: email,
      role: role,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    setToken(null);
    localStorage.removeItem('pvi_token');
    setUser(null);
  };

  const switchRole = (newRole) => {
    localStorage.setItem('pvi_active_role', newRole);
    setUser((prev) => (prev ? { ...prev, role: newRole } : prev));
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        loginWithDemo,
        logout,
        switchRole,
      }}
    >
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
