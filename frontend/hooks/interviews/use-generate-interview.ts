"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { generateInterview } from "@/services/interview.service";
import { INTERVIEWS_QUERY_KEY } from "@/hooks/interviews/use-interviews";
import type { InterviewGeneratePayload } from "@/types/interview.types";

export function useGenerateInterview() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InterviewGeneratePayload) => generateInterview(payload),
    onSuccess: (session) => {
      queryClient.setQueryData(["interviews", session.id], session);
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
      router.push(`/interviews/${session.id}`);
    },
  });
}
