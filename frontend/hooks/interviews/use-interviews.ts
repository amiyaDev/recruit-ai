"use client";

import { useQuery } from "@tanstack/react-query";

import { listInterviews } from "@/services/interview.service";
import type { ListInterviewsParams } from "@/types/interview.types";

export const INTERVIEWS_QUERY_KEY = ["interviews"] as const;

export function useInterviews(params: ListInterviewsParams = {}) {
  return useQuery({
    queryKey: [...INTERVIEWS_QUERY_KEY, params],
    queryFn: () => listInterviews(params),
  });
}
