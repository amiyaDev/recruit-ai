"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setAuthTokens } from "@/lib/cookies";
import { loginUser } from "@/services/auth.service";
import { CURRENT_USER_QUERY_KEY } from "@/hooks/auth/use-current-user";
import type { LoginPayload } from "@/types/auth.types";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: async (tokens) => {
      setAuthTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: CURRENT_USER_QUERY_KEY });
      router.push("/dashboard");
    },
  });
}
