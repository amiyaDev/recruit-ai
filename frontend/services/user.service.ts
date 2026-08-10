import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope, User } from "@/types/auth.types";
import type { UserUpdatePayload } from "@/types/user.types";

// Canonical query key for "the current user's profile" — used by both the
// fetch query and the update mutation (via queryClient.setQueryData) so
// every consumer (topbar, settings) reads from one cache entry instead of
// each hitting its own endpoint/key for the same underlying data.
export const USER_QUERY_KEY = ["user", "me"] as const;

export async function fetchProfile(): Promise<User> {
  const { data } = await apiClient.get<ApiEnvelope<User>>("/users/me");
  return data.data;
}

export async function updateProfile(payload: UserUpdatePayload): Promise<User> {
  const { data } = await apiClient.patch<ApiEnvelope<User>>("/users/me", payload);
  return data.data;
}
