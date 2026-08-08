// Mirrors the Postgres schema in CLAUDE.md §5 for the modules with a
// dashboard UI. Mock-data only for now — no API client uses these yet.

export type ResumeFileType = "pdf" | "docx";
export type ResumeStatus = "uploaded" | "parsing" | "parsed" | "failed";

export interface ParsedResumeData {
  email?: string;
  phone?: string;
  skills: string[];
}

export interface Resume {
  id: string;
  filename: string;
  fileType: ResumeFileType;
  status: ResumeStatus;
  parsedData?: ParsedResumeData;
  rawTextExcerpt?: string;
  fileSizeLabel: string;
  createdAt: string;
  updatedAt: string;
}

export type JobStatus = "pending" | "processing" | "ready" | "failed";

export interface Job {
  id: string;
  title: string;
  company?: string;
  description: string;
  extractedKeywords: string[];
  status: JobStatus;
  createdAt: string;
}

export interface AtsScore {
  id: string;
  resumeId: string;
  jobId: string;
  score: number;
  missingKeywords: string[];
  suggestions: { title: string; detail: string; icon: string }[];
  createdAt: string;
}

export type Difficulty = "easy" | "medium" | "hard";
export type InterviewStatus = "in_progress" | "completed";
export type QuestionType = "technical" | "behavioral";

export interface InterviewQuestion {
  id: string;
  sessionId: string;
  questionText: string;
  questionType: QuestionType;
  userAnswer?: string;
  aiFeedback?: string;
  score?: number;
}

export interface InterviewSession {
  id: string;
  resumeId?: string;
  jobId?: string;
  difficulty: Difficulty;
  status: InterviewStatus;
  overallScore?: number;
  overallSummary?: string;
  createdAt: string;
  questions: InterviewQuestion[];
}

export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  id: string;
  sessionId: string;
  role: ChatRole;
  content: string;
  createdAt: string;
  suggestionChips?: string[];
}

export interface ChatSession {
  id: string;
  resumeId?: string;
  title: string;
  createdAt: string;
  messages: ChatMessage[];
}

export type UserRole = "user" | "recruiter" | "admin";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  isVerified: boolean;
  createdAt: string;
}
