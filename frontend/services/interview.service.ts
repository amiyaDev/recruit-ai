import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth.types";
import type {
  InterviewAnswerPayload,
  InterviewGeneratePayload,
  InterviewSession,
  InterviewSessionListItem,
  ListInterviewsParams,
} from "@/types/interview.types";

export async function listInterviews(params: ListInterviewsParams = {}): Promise<InterviewSessionListItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<InterviewSessionListItem[]>>("/interviews/", {
    params: { skip: params.skip ?? 0, limit: params.limit ?? 20 },
  });
  return data.data;
}

export async function getInterview(id: string): Promise<InterviewSession> {
  const { data } = await apiClient.get<ApiEnvelope<InterviewSession>>(`/interviews/${id}`);
  return data.data;
}

export async function generateInterview(payload: InterviewGeneratePayload): Promise<InterviewSession> {
  const { data } = await apiClient.post<ApiEnvelope<InterviewSession>>("/interviews/generate", payload);
  return data.data;
}

export async function answerQuestion(sessionId: string, payload: InterviewAnswerPayload): Promise<void> {
  await apiClient.post(`/interviews/${sessionId}/answer`, payload);
}

export async function evaluateInterview(sessionId: string): Promise<InterviewSession> {
  const { data } = await apiClient.post<ApiEnvelope<InterviewSession>>(`/interviews/${sessionId}/evaluate`);
  return data.data;
}
