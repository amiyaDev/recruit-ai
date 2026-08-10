"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteJob } from "@/services/job.service";
import { JOBS_QUERY_KEY } from "@/hooks/jobs/use-jobs";

export function useDeleteJob() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteJob(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      router.push("/jobs");
    },
  });
}
