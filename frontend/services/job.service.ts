import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth.types";
import type { Job, JobCreatePayload, JobListItem, ListJobsParams } from "@/types/job.types";

export async function listJobs(params: ListJobsParams = {}): Promise<JobListItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<JobListItem[]>>("/jobs/", {
    params: { skip: params.skip ?? 0, limit: params.limit ?? 20 },
  });
  return data.data;
}

export async function getJob(id: string): Promise<Job> {
  const { data } = await apiClient.get<ApiEnvelope<Job>>(`/jobs/${id}`);
  return data.data;
}

export async function createJob(payload: JobCreatePayload): Promise<Job> {
  const { data } = await apiClient.post<ApiEnvelope<Job>>("/jobs/", payload);
  return data.data;
}

export async function deleteJob(id: string): Promise<void> {
  await apiClient.delete(`/jobs/${id}`);
}
