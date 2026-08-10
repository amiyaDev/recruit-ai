"use client";

import { useQuery } from "@tanstack/react-query";

import { getAtsScore } from "@/services/ats.service";

export function useAtsScore(id: string) {
  return useQuery({
    queryKey: ["ats", id],
    queryFn: () => getAtsScore(id),
    enabled: Boolean(id),
    retry: false,
  });
}
