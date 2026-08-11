"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { evaluateInterview } from "@/services/interview.service";
import { INTERVIEWS_QUERY_KEY } from "@/hooks/interviews/use-interviews";

export function useEvaluateInterview(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => evaluateInterview(sessionId),
    onSuccess: (updated) => {
      queryClient.setQueryData(["interviews", sessionId], updated);
      queryClient.invalidateQueries({ queryKey: INTERVIEWS_QUERY_KEY });
    },
  });
}
