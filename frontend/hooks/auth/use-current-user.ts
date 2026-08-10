"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { getAuthTokens } from "@/lib/cookies";
import { fetchCurrentUser } from "@/services/auth.service";

export const CURRENT_USER_QUERY_KEY = ["auth", "me"] as const;

export function useCurrentUser() {
  // Cookies can only be read on the client. Checking them during the very
  // first render (which must match the server-rendered HTML for hydration)
  // would make `enabled` differ between the server pass (no cookies) and
  // the client's first pass (cookies present), corrupting hydration.
  // Deferring to after mount matches the pattern already used in
  // components/theme/theme-toggle.tsx for the same class of problem.
  const [mounted, setMounted] = useState(false);
  // Defer setting state to the next macrotask to avoid synchronous setState in
  // the effect body which can cause cascading renders.
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  return useQuery({
    queryKey: CURRENT_USER_QUERY_KEY,
    queryFn: fetchCurrentUser,
    enabled: mounted && Boolean(getAuthTokens().refreshToken),
  });
}
