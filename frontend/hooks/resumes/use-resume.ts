"use client";

import { useQuery } from "@tanstack/react-query";

import { getResume } from "@/services/resume.service";

export function useResume(id: string) {
  return useQuery({
    queryKey: ["resumes", id],
    queryFn: () => getResume(id),
    enabled: Boolean(id),
    retry: false,
  });
}
