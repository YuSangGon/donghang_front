export interface SignUpRequest {
  loginId: string;
  password: string;
  email: string;
  nickname: string;
  gender: "MALE" | "FEMALE";
}

export interface LoginRequest {
  loginId: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  userId: number;
  loginId: string;
  nickname: string;
}
