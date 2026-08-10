"use client";

import { useQuery } from "@tanstack/react-query";

import { listResumes } from "@/services/resume.service";
import type { ListResumesParams } from "@/types/resume.types";

export const RESUMES_QUERY_KEY = ["resumes"] as const;

export function useResumes(params: ListResumesParams = {}) {
  return useQuery({
    queryKey: [...RESUMES_QUERY_KEY, params],
    queryFn: () => listResumes(params),
  });
}
