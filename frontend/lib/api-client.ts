"use client";

import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { clearAuthTokens, getAuthTokens, setAuthTokens } from "@/lib/cookies";
import type { ApiEnvelope, TokenResponse } from "@/types/auth.types";

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

// Auth endpoints that must never trigger the 401-refresh-retry cycle below —
// hitting refresh's own 401 (expired/invalid refresh token) with the same
// logic would recurse forever.
const AUTH_ENDPOINTS = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/logout"];

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.request.use((config) => {
  const { accessToken } = getAuthTokens();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Plain axios instance for the refresh call itself — deliberately bypasses
// apiClient's interceptors so it can't recursively trigger this same logic.
const refreshClient = axios.create({ baseURL: API_BASE_URL });

let refreshPromise: Promise<TokenResponse> | null = null;

export function refreshAccessToken(): Promise<TokenResponse> {
  const { refreshToken } = getAuthTokens();
  if (!refreshToken) {
    return Promise.reject(new Error("No refresh token available"));
  }

  // De-dupe concurrent 401s into a single in-flight refresh call.
  if (!refreshPromise) {
    refreshPromise = refreshClient
      .post<ApiEnvelope<TokenResponse>>("/auth/refresh", { refresh_token: refreshToken })
      .then(({ data }) => {
        setAuthTokens(data.data);
        return data.data;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

interface RetriableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as RetriableConfig | undefined;
    const isAuthEndpoint = AUTH_ENDPOINTS.some((path) => config?.url?.includes(path));

    // Only retry on 401 (invalid/expired token). A 403 means no token was
    // sent at all (HTTPBearer's default) — there's nothing to refresh.
    if (error.response?.status !== 401 || isAuthEndpoint || !config || config._retried) {
      throw error;
    }

    config._retried = true;

    try {
      const tokens = await refreshAccessToken();
      config.headers.Authorization = `Bearer ${tokens.access_token}`;
      return apiClient(config);
    } catch (refreshError) {
      clearAuthTokens();
      if (typeof window !== "undefined") {
        window.location.href = "/login";
      }
      throw refreshError;
    }
  }
);
