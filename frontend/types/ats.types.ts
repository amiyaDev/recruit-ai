// Mirrors backend/schemas/ats_schemas.py exactly.

export interface AtsScore {
  id: string;
  resume_id: string;
  job_id: string;
  score: number;
  missing_keywords: string[] | null;
  suggestions: string[] | null;
  created_at: string;
}

export interface AtsAnalyzePayload {
  resume_id: string;
  job_id: string;
}
