import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthContextType, User } from '../types';
import { apiService } from '../services/axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    const response = await apiService.login(email, password);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: '',
      name: response.name,
      email: response.email,
      role: response.role,
      createdAt: new Date().toISOString(),
    }));
    setToken(response.token);
    setUser({
      id: '',
      name: response.name,
      email: response.email,
      role: response.role,
      createdAt: new Date().toISOString(),
    });
  };

  const register = async (name: string, email: string, password: string) => {
    const response = await apiService.register(name, email, password);
    localStorage.setItem('token', response.token);
    localStorage.setItem('user', JSON.stringify({
      id: '',
      name: response.name,
      email: response.email,
      role: response.role,
      createdAt: new Date().toISOString(),
    }));
    setToken(response.token);
    setUser({
      id: '',
      name: response.name,
      email: response.email,
      role: response.role,
      createdAt: new Date().toISOString(),
    });
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        register,
        logout,
        isAuthenticated: !!token,
        isAdmin: user?.role === 'ADMIN',
      }}
    >
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
