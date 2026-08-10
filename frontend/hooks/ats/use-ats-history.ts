"use client";

import { useQuery } from "@tanstack/react-query";

import { listAtsForResume } from "@/services/ats.service";

export function useAtsHistory(resumeId: string | undefined) {
  return useQuery({
    queryKey: ["ats", "resume", resumeId],
    queryFn: () => listAtsForResume(resumeId as string),
    enabled: Boolean(resumeId),
  });
}
