"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { setAuthTokens } from "@/lib/cookies";
import { loginUser } from "@/services/auth.service";
import { USER_QUERY_KEY } from "@/services/user.service";
import type { LoginPayload } from "@/types/auth.types";

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => loginUser(payload),
    onSuccess: async (tokens) => {
      setAuthTokens(tokens);
      await queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
      router.push("/dashboard");
    },
  });
}
