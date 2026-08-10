"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createJob } from "@/services/job.service";
import { JOBS_QUERY_KEY } from "@/hooks/jobs/use-jobs";

export function useCreateJob() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createJob,
    onSuccess: (job) => {
      queryClient.invalidateQueries({ queryKey: JOBS_QUERY_KEY });
      queryClient.setQueryData(["jobs", job.id], job);
      router.push(`/jobs/${job.id}`);
    },
  });
}
