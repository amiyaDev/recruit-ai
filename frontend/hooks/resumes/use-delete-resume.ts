"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteResume } from "@/services/resume.service";
import { RESUMES_QUERY_KEY } from "@/hooks/resumes/use-resumes";

export function useDeleteResume() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResume(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
      router.push("/resumes");
    },
  });
}
