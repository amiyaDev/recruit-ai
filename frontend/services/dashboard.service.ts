import { apiClient } from "@/lib/api-client";
import type { ApiEnvelope } from "@/types/auth.types";
import type { DashboardSummary } from "@/types/dashboard-summary.types";

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const { data } = await apiClient.get<ApiEnvelope<DashboardSummary>>("/dashboard/summary");
  return data.data;
}
