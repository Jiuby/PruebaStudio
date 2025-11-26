
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { UserProfile } from '../types';
import { MOCK_USER } from '../constants';

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string) => void;
  register: (data: Partial<UserProfile>) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  const login = (email: string) => {
    // Simulating login
    setUser({ ...MOCK_USER, email });
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
        register,
        logout,
        isAuthenticated: !!user,
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
