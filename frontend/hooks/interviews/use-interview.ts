"use client";

import { useQuery } from "@tanstack/react-query";

import { getInterview } from "@/services/interview.service";

export function useInterview(id: string) {
  return useQuery({
    queryKey: ["interviews", id],
    queryFn: () => getInterview(id),
    enabled: Boolean(id),
    retry: false,
  });
}
