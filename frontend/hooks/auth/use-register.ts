"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";

import { registerUser } from "@/services/auth.service";
import type { RegisterPayload } from "@/types/auth.types";

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => registerUser(payload),
    onSuccess: () => {
      // Register doesn't return tokens (no auto-login) — send the user to
      // log in with their new credentials.
      router.push("/login?registered=1");
    },
  });
}
