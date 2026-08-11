// Mirrors backend/schemas/chat_schemas.py and core/constants.py exactly.

export type ChatRole = "user" | "assistant";

// GET /chat/sessions/{id}
export interface ChatMessage {
  id: string;
  role: ChatRole;
  content: string;
  created_at: string;
}

// GET /chat/sessions/, POST /chat/sessions
export interface ChatSession {
  id: string;
  resume_id: string | null;
  title: string | null;
  created_at: string;
}

export interface ChatSessionCreatePayload {
  resume_id?: string;
}

export interface ListChatSessionsParams {
  skip?: number;
  limit?: number;
}
