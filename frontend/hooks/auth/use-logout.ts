"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { clearAuthTokens, getAuthTokens } from "@/lib/cookies";
import { logoutUser } from "@/services/auth.service";

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { refreshToken } = getAuthTokens();
      if (refreshToken) {
        // Best-effort — the user should end up logged out locally even if
        // this call fails (e.g. the refresh token already expired).
        await logoutUser(refreshToken).catch(() => undefined);
      }
    },
    onSettled: () => {
      clearAuthTokens();
      queryClient.clear();
      router.push("/login");
    },
  });
}
