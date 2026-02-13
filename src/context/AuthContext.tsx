'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';
import { authAPI } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (data: {
    name: string;
    email: string;
    password: string;
    phone?: string;
    address?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from cookie on mount
  useEffect(() => {
    const loadUser = () => {
      try {
        const authCookie = document.cookie
          .split('; ')
          .find(row => row.startsWith('quickcart_auth='));

        if (authCookie) {
          const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
          
          if (authData.expiresAt > Date.now()) {
            setUser(authData.user);
          } else {
            document.cookie = 'quickcart_auth=; path=/; max-age=0';
          }
        }
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login with:', email);
      
      const result = await authAPI.login(email, password);
      
      console.log('📥 API Response:', result);
      
      if (result.success && result.data) {
        const apiUser = result.data.user;
        
        const userData: User = {
          id: apiUser.id,
          name: apiUser.email.split('@')[0],
          email: apiUser.email,
          role: apiUser.role === 'admin' ? 'admin' : 'client',
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        console.log('✅ User data created:', userData);

        const authData = {
          user: userData,
          token: result.data.token,
          expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        };

        document.cookie = `quickcart_auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=${7 * 24 * 60 * 60}`;
        
        setUser(userData);
        
        console.log('🎉 Login successful! Role:', userData.role);
        
        return { success: true, role: userData.role };
      }
      
      console.error('❌ Login failed:', result.error);
      return { success: false, error: result.error || 'Login failed' };
    } catch (error) {
      console.error('💥 Login error:', error);
      return { success: false, error: 'An error occurred during login' };
    }
  };

const register = async (data: {
  name: string;
  email: string;
  password: string; // ignored for now
  phone?: string;
  address?: string;
}) => {
  try {
    console.log("📝 Attempting registration with:", data.email);

    const result = await authAPI.register({
      name: data.name,
      email: data.email,
      phone: data.phone,
      address: data.address,
    });

    console.log("📥 Register API Response:", result);

    if (result.success && result.data) {
      const apiUser = result.data;

      const userData: User = {
        id: apiUser._id,
        name: apiUser.name,
        email: apiUser.email,
        role: "client",
        phone: apiUser.phone,
        address: apiUser.address,
        createdAt: new Date(apiUser.createdAt),
        updatedAt: new Date(apiUser.updatedAt),
      };

      setUser(userData);
      return { success: true };
    }

    return { success: false, error: result.error };
  } catch (error) {
    return { success: false, error: "Registration failed" };
  }
};


  const logout = () => {
    console.log('👋 Logging out...');
    document.cookie = 'quickcart_auth=; path=/; max-age=0';
    setUser(null);
  };

  const updateUser = (userData: Partial<User>) => {
    if (!user) return;

    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);

    try {
      const authCookie = document.cookie
        .split('; ')
        .find(row => row.startsWith('quickcart_auth='));

      if (authCookie) {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        authData.user = updatedUser;
        document.cookie = `quickcart_auth=${encodeURIComponent(JSON.stringify(authData))}; path=/; max-age=${7 * 24 * 60 * 60}`;
      }
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}