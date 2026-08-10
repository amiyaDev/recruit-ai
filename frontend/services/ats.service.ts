import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth.types";
import type { AtsAnalyzePayload, AtsScore } from "@/types/ats.types";

export async function analyzeAts(payload: AtsAnalyzePayload): Promise<AtsScore> {
  const { data } = await apiClient.post<ApiEnvelope<AtsScore>>("/ats/analyze", payload);
  return data.data;
}

export async function getAtsScore(id: string): Promise<AtsScore> {
  const { data } = await apiClient.get<ApiEnvelope<AtsScore>>(`/ats/${id}`);
  return data.data;
}

export async function listAtsForResume(resumeId: string): Promise<AtsScore[]> {
  const { data } = await apiClient.get<ApiEnvelope<AtsScore[]>>(`/ats/resume/${resumeId}`);
  return data.data;
}
