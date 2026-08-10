"use client";

import { destroyCookie, parseCookies, setCookie } from "nookies";

import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "@/lib/auth-cookie-names";
import type { TokenResponse } from "@/types/auth.types";

// Client-set cookies, not httpOnly — the backend returns tokens in the JSON
// body rather than setting Set-Cookie itself, and nookies sets cookies from
// browser JS, which by definition can't be httpOnly. Documented trade-off,
// see the "Auth API Integration" plan.
export { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE };

const ACCESS_TOKEN_MAX_AGE = 15 * 60; // 15 minutes — mirrors backend ACCESS_TOKEN_EXPIRE_MINUTES
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60; // 7 days — mirrors backend REFRESH_TOKEN_EXPIRE_DAYS

const baseCookieOptions = {
  path: "/",
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
};

export function setAuthTokens(tokens: TokenResponse) {
  setCookie(null, ACCESS_TOKEN_COOKIE, tokens.access_token, {
    ...baseCookieOptions,
    maxAge: ACCESS_TOKEN_MAX_AGE,
  });
  setCookie(null, REFRESH_TOKEN_COOKIE, tokens.refresh_token, {
    ...baseCookieOptions,
    maxAge: REFRESH_TOKEN_MAX_AGE,
  });
}

export function getAuthTokens() {
  const cookies = parseCookies(null);
  return {
    accessToken: cookies[ACCESS_TOKEN_COOKIE],
    refreshToken: cookies[REFRESH_TOKEN_COOKIE],
  };
}

export function clearAuthTokens() {
  destroyCookie(null, ACCESS_TOKEN_COOKIE, { path: "/" });
  destroyCookie(null, REFRESH_TOKEN_COOKIE, { path: "/" });
}
