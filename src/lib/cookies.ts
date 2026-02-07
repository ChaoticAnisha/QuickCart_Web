'use server';

import { cookies } from 'next/headers';
import { User, UserRole } from '@/types';

const AUTH_COOKIE_NAME = 'quickcart_auth';
const COOKIE_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface AuthCookie {
  user: User;
  token: string;
  expiresAt: number;
}

export async function setAuthCookie(user: User, token: string) {
  const cookieStore = await cookies();
  const authData: AuthCookie = {
    user,
    token,
    expiresAt: Date.now() + COOKIE_MAX_AGE * 1000,
  };

  cookieStore.set(AUTH_COOKIE_NAME, JSON.stringify(authData), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: COOKIE_MAX_AGE,
    path: '/',
  });
}

export async function getAuthCookie(): Promise<AuthCookie | null> {
  const cookieStore = await cookies();
  const authCookie = cookieStore.get(AUTH_COOKIE_NAME);

  if (!authCookie) {
    return null;
  }

  try {
    const authData: AuthCookie = JSON.parse(authCookie.value);

    if (authData.expiresAt < Date.now()) {
      await clearAuthCookie();
      return null;
    }

    return authData;
  } catch (error) {
    await clearAuthCookie();
    return null;
  }
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export async function getCurrentUser(): Promise<User | null> {
  const authData = await getAuthCookie();
  return authData?.user || null;
}

export async function getAuthToken(): Promise<string | null> {
  const authData = await getAuthCookie();
  return authData?.token || null;
}

export async function isAuthenticated(): Promise<boolean> {
  const authData = await getAuthCookie();
  return authData !== null;
}

export async function hasRole(role: UserRole): Promise<boolean> {
  const user = await getCurrentUser();
  return user?.role === role;
}

export async function isAdmin(): Promise<boolean> {
  return hasRole('admin');
}

export async function isClient(): Promise<boolean> {
  return hasRole('client');
}