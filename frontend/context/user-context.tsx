"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { getAuthTokens } from "@/lib/cookies";
import { getApiErrorMessage } from "@/lib/api-error";
import { fetchProfile, updateProfile, USER_QUERY_KEY } from "@/services/user.service";
import type { User } from "@/types/auth.types";
import type { UserUpdatePayload } from "@/types/user.types";

interface UserContextValue {
  user: User | undefined;
  isLoading: boolean;
  isError: boolean;
  errorMessage: string | null;
  refetch: () => void;
  updateProfile: (payload: UserUpdatePayload) => void;
  isUpdating: boolean;
  updateErrorMessage: string | null;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  // Cookies can only be read on the client — checking them during the very
  // first render (which must match the server-rendered HTML for hydration)
  // would make `enabled` differ between the server pass (no cookies) and
  // the client's first pass (cookies present), corrupting hydration.
  // Deferring to a post-mount macrotask matches the pattern already used
  // for this exact problem elsewhere in the auth hooks.
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(id);
  }, []);

  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: USER_QUERY_KEY,
    queryFn: fetchProfile,
    enabled: mounted && Boolean(getAuthTokens().refreshToken),
  });

  const mutation = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updatedUser) => {
      queryClient.setQueryData(USER_QUERY_KEY, updatedUser);
    },
  });

  const value = useMemo<UserContextValue>(
    () => ({
      user: query.data,
      isLoading: query.isLoading,
      isError: query.isError,
      errorMessage: query.isError ? getApiErrorMessage(query.error) : null,
      refetch: () => {
        query.refetch();
      },
      updateProfile: mutation.mutate,
      isUpdating: mutation.isPending,
      updateErrorMessage: mutation.isError ? getApiErrorMessage(mutation.error) : null,
    }),
    [query, mutation]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
