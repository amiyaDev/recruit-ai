"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { reparseResume } from "@/services/resume.service";
import { RESUMES_QUERY_KEY } from "@/hooks/resumes/use-resumes";

export function useReparseResume(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reparseResume(id),
    onSuccess: (updated) => {
      queryClient.setQueryData(["resumes", id], updated);
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
    },
  });
}
