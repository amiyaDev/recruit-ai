// Mirrors backend/schemas/dashboard_schemas.py exactly.

import type { ResumeStatus } from "@/types/resume.types";

export interface RecentResumeItem {
  id: string;
  filename: string;
  status: ResumeStatus;
  created_at: string;
}

export interface RecentAtsScoreItem {
  id: string;
  score: number;
  job_title: string;
  job_company: string | null;
  created_at: string;
}

export interface UsageSummary {
  spent_usd: number;
  budget_usd: number;
  percent: number;
}

// GET /dashboard/summary
export interface DashboardSummary {
  resume_count: number;
  job_count: number;
  interview_count: number;
  chat_count: number;
  avg_ats_score: number | null;
  recent_resumes: RecentResumeItem[];
  recent_ats_scores: RecentAtsScoreItem[];
  usage: UsageSummary;
}
