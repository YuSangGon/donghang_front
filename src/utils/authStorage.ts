import type { AuthResponse } from "../types/auth";

const ACCESS_TOKEN_KEY = "donghaeng_access_token";
const USER_KEY = "donghaeng_user";

export interface StoredUser {
  userId: number;
  loginId: string;
  nickname: string;
}

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: auth.userId,
      loginId: auth.loginId,
      nickname: auth.nickname,
    } satisfies StoredUser),
  );
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function isLoggedIn(): boolean {
  return !!getAccessToken() && !!getStoredUser();
}
