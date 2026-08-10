import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, LoginPayload, RegisterPayload, TokenResponse, User } from "@/types/auth.types";

export async function registerUser(payload: RegisterPayload): Promise<User> {
  const { data } = await apiClient.post<ApiEnvelope<User>>("/auth/register", payload);
  return data.data;
}

export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  const { data } = await apiClient.post<ApiEnvelope<TokenResponse>>("/auth/login", payload);
  return data.data;
}

export async function refreshTokens(refreshToken: string): Promise<TokenResponse> {
  const { data } = await apiClient.post<ApiEnvelope<TokenResponse>>("/auth/refresh", {
    refresh_token: refreshToken,
  });
  return data.data;
}

export async function logoutUser(refreshToken: string): Promise<void> {
  await apiClient.post("/auth/logout", { refresh_token: refreshToken });
}

export async function fetchCurrentUser(): Promise<User> {
  const { data } = await apiClient.get<ApiEnvelope<User>>("/auth/me");
  return data.data;
}
