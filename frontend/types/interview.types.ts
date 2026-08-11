// Mirrors backend/schemas/interview_schemas.py and core/constants.py exactly.

export type InterviewDifficulty = "easy" | "medium" | "hard";
export type InterviewSessionStatus = "in_progress" | "completed";
export type QuestionType = "technical" | "behavioral";

export interface InterviewQuestion {
  id: string;
  question_text: string;
  question_type: QuestionType;
  user_answer: string | null;
  ai_feedback: string | null;
  ideal_answer: string | null; // NEW
  score: number | null;
}

// GET /interviews/{id}, POST /interviews/generate, POST /interviews/{id}/evaluate
export interface InterviewSession {
  id: string;
  resume_id: string | null;
  job_id: string | null;
  difficulty: InterviewDifficulty;
  status: InterviewSessionStatus;
  overall_score: number | null;
  questions: InterviewQuestion[];
  created_at: string;
}

// GET /interviews/ — lighter list projection, no questions on the wire.
export interface InterviewSessionListItem {
  id: string;
  resume_id: string | null;
  job_id: string | null;
  difficulty: InterviewDifficulty;
  status: InterviewSessionStatus;
  overall_score: number | null;
  created_at: string;
}

export interface ListInterviewsParams {
  skip?: number;
  limit?: number;
}

export interface InterviewGeneratePayload {
  resume_id?: string;
  job_id?: string;
  difficulty: InterviewDifficulty;
}

export interface InterviewAnswerPayload {
  question_id: string;
  answer: string;
}
