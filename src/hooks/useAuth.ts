'use client';

import { useState, useEffect } from 'react';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Get user from cookie
    const authCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('quickcart_auth='));

    if (authCookie) {
      try {
        const authData = JSON.parse(decodeURIComponent(authCookie.split('=')[1]));
        if (authData.expiresAt > Date.now()) {
          // eslint-disable-next-line react-hooks/set-state-in-effect
          setUser(authData.user);
        }
      } catch (error) {
        console.error('Error parsing auth cookie:', error);
      }
    }

    setIsLoading(false);
  }, []);

  const isAuthenticated = !!user;
  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';

  return {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    isClient,
  };
}