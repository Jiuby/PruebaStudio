
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types';
import { MOCK_USER } from '../constants';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string) => void;
  loginAdmin: (email: string, password: string) => boolean;
  register: (data: Partial<UserProfile>) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string) => {
    // Simulating user login
    setUser({ ...MOCK_USER, email, role: 'user' });
  };

  const loginAdmin = (email: string, password: string): boolean => {
    // Mock Admin Credentials
    if (email === 'admin@goustty.com' && password === 'admin') {
      setUser({
        id: 'admin-001',
        name: 'Goustty Admin',
        email: 'admin@goustty.com',
        role: 'admin',
        joinDate: 'Jan 01, 2024'
      });
      return true;
    }
    return false;
  };

  const register = (data: Partial<UserProfile>) => {
    // Simulating register
    setUser({
      id: Math.random().toString(36).substr(2, 9),
      name: data.name || 'New User',
      email: data.email || '',
      phone: '',
      address: '',
      city: '',
      zip: '',
      role: 'user',
      joinDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        loginAdmin,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
