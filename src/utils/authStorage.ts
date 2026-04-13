import type { AuthResponse } from "../types/auth";

const ACCESS_TOKEN_KEY = "donghang_access_token";
const USER_KEY = "donghang_user";

export function saveAuth(auth: AuthResponse) {
  localStorage.setItem(ACCESS_TOKEN_KEY, auth.accessToken);
  localStorage.setItem(
    USER_KEY,
    JSON.stringify({
      userId: auth.userId,
      loginId: auth.loginId,
      nickname: auth.nickname,
    }),
  );
}

export function clearAuth() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getStoredUser(): {
  userId: number;
  loginId: string;
  nickname: string;
} | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
