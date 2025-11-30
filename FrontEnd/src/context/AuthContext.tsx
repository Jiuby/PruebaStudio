
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { authService, User, RegisterData, LoginData } from '../services/auth';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      authService.getProfile(storedToken)
        .then(userData => {
          setUser(userData);
          setToken(storedToken);
        })
        .catch(() => {
          // Token is invalid, clear it
          localStorage.removeItem('authToken');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const response = await authService.login({ email, password });
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('authToken', response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
      throw err;
    }
  };

  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await authService.login({ email, password });
      if (response.user.is_staff) {
        setUser(response.user);
        setToken(response.token);
        localStorage.setItem('authToken', response.token);
        return true;
      } else {
        // User is valid but not admin
        return false;
      }
    } catch (error) {
      console.error("Admin login failed", error);
      return false;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setError(null);
      const response = await authService.register(data);
      setUser(response.user);
      setToken(response.token);
      localStorage.setItem('authToken', response.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('authToken');
  };

  // Check if user is admin based on is_staff flag from backend
  const isAdmin = !!user?.is_staff;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        loginAdmin,
        register,
        logout,
        isAuthenticated: !!user,
        isAdmin,
        loading,
        error
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
