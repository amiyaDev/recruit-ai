"use client";

import { useQuery } from "@tanstack/react-query";

import { getJob } from "@/services/job.service";

export function useJob(id: string) {
  return useQuery({
    queryKey: ["jobs", id],
    queryFn: () => getJob(id),
    enabled: Boolean(id),
    retry: false,
  });
}
