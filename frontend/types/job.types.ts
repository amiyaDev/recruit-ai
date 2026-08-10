// Mirrors backend/schemas/job_schemas.py and core/constants.py exactly.

export type JobStatus = "pending" | "processing" | "ready" | "failed";

// GET /jobs/{id}, POST /jobs/
export interface Job {
  id: string;
  title: string;
  company: string | null;
  description: string;
  extracted_keywords: string[] | null;
  status: JobStatus;
  created_at: string;
}

// GET /jobs/ — lighter list projection, no description/extracted_keywords on the wire.
export interface JobListItem {
  id: string;
  title: string;
  company: string | null;
  status: JobStatus;
  created_at: string;
}

export interface ListJobsParams {
  skip?: number;
  limit?: number;
}

export interface JobCreatePayload {
  title: string;
  company?: string;
  description: string;
}
