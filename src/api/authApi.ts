import type { AuthResponse, LoginRequest, SignUpRequest } from "../types/auth";

const BASE_URL = "/api/auth";

export async function signUp(request: SignUpRequest): Promise<number> {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("회원가입에 실패했습니다.");
  }

  return response.json();
}

export async function login(request: LoginRequest): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error("로그인에 실패했습니다.");
  }

  return response.json();
}
