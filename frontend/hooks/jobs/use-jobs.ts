"use client";

import { useQuery } from "@tanstack/react-query";

import { listJobs } from "@/services/job.service";
import type { ListJobsParams } from "@/types/job.types";

export const JOBS_QUERY_KEY = ["jobs"] as const;

export function useJobs(params: ListJobsParams = {}) {
  return useQuery({
    queryKey: [...JOBS_QUERY_KEY, params],
    queryFn: () => listJobs(params),
  });
}
