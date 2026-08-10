import type { AxiosProgressEvent } from "axios";

import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth.types";
import type { ListResumesParams, Resume, ResumeListItem } from "@/types/resume.types";

export async function listResumes(params: ListResumesParams = {}): Promise<ResumeListItem[]> {
  const { data } = await apiClient.get<ApiEnvelope<ResumeListItem[]>>("/resumes/", {
    params: { skip: params.skip ?? 0, limit: params.limit ?? 20 },
  });
  return data.data;
}

export async function getResume(id: string): Promise<Resume> {
  const { data } = await apiClient.get<ApiEnvelope<Resume>>(`/resumes/${id}`);
  return data.data;
}

export async function uploadResume(
  file: File,
  onUploadProgress?: (event: AxiosProgressEvent) => void
): Promise<Resume> {
  const formData = new FormData();
  formData.append("file", file);

  const { data } = await apiClient.post<ApiEnvelope<Resume>>("/resumes/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress,
  });
  return data.data;
}

export async function deleteResume(id: string): Promise<void> {
  await apiClient.delete(`/resumes/${id}`);
}

export async function reparseResume(id: string): Promise<Resume> {
  const { data } = await apiClient.post<ApiEnvelope<Resume>>(`/resumes/${id}/reparse`);
  return data.data;
}
