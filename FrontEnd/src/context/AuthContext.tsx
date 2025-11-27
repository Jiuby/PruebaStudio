
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
        name: 'Goustty Admin',
        email: 'admin@goustty.com',
        role: 'admin'
      } as UserProfile);
      return true;
    }
    return false;
  };

  const register = (data: Partial<UserProfile>) => {
    // Simulating register
    setUser({
      name: data.name || 'New User',
      email: data.email || '',
      phone: '',
      address: '',
      city: '',
      zip: '',
      role: 'user'
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
