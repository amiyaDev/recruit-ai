// Mirrors backend/schemas/resume_schema.py and core/constants.py exactly.

export type ResumeFileType = "pdf" | "docx";
export type ResumeStatus = "uploaded" | "parsing" | "parsed" | "failed";

export interface ParsedResumeData {
  email: string | null;
  phone: string | null;
  skills: string[];
}

// GET /resumes/{id}, POST /resumes/, POST /resumes/{id}/reparse
export interface Resume {
  id: string;
  filename: string;
  file_type: ResumeFileType;
  status: ResumeStatus;
  parsed_data: ParsedResumeData | null;
  created_at: string;
}

// GET /resumes/ — lighter list projection, no parsed_data/file_type on the wire.
export interface ResumeListItem {
  id: string;
  filename: string;
  status: ResumeStatus;
  created_at: string;
}

export interface ListResumesParams {
  skip?: number;
  limit?: number;
}
