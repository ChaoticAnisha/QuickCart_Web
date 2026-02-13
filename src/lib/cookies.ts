// lib/cookies.ts (client-safe)
import Cookies from "js-cookie";

const TOKEN_KEY = "auth_token";
const ROLE_KEY = "auth_role";

export function setAuthToken(token: string, role?: string) {
  Cookies.set(TOKEN_KEY, token, { expires: 7 });
  if (role) Cookies.set(ROLE_KEY, role, { expires: 7 });
}

export function getAuthToken() {
  return Cookies.get(TOKEN_KEY);
}

export function getAuthRole() {
  return Cookies.get(ROLE_KEY);
}

export function clearAuth() {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(ROLE_KEY);
}
