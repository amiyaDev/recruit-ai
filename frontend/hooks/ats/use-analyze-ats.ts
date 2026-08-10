"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { analyzeAts } from "@/services/ats.service";
import type { AtsAnalyzePayload } from "@/types/ats.types";

export function useAnalyzeAts() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: AtsAnalyzePayload) => analyzeAts(payload),
    onSuccess: (score) => {
      queryClient.setQueryData(["ats", score.id], score);
      queryClient.invalidateQueries({ queryKey: ["ats", "resume", score.resume_id] });
      router.push(`/ats/${score.id}`);
    },
  });
}
