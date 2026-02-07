'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authAPI } from '@/lib/api';
import { useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('quickcart_auth='));

    if (authCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        if (authData.expiresAt > Date.now()) {
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
      }
    }

    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data) {
        const { user, token } = response.data;
        
        // Set cookie
        const authData = {
          user,
          token,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };
        
        document.cookie = `quickcart_auth=${JSON.stringify(authData)}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        setUser(user);
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Login failed' };
    } catch (error) {
      return { success: false, error: 'An error occurred' };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      document.cookie = 'quickcart_auth=; path=/; max-age=0';
      setUser(null);
      router.push('/login');
    }
  };

  const updateUser = (updatedUser: User) => {
    setUser(updatedUser);
    
    // Update cookie
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('quickcart_auth='));
    
    if (authCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        authData.user = updatedUser;
        document.cookie = `quickcart_auth=${JSON.stringify(authData)}; path=/; max-age=${7 * 24 * 60 * 60}`;
      } catch (error) {
        console.error('Error updating auth cookie:', error);
      }
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}