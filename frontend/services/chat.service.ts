import { apiClient, API_BASE_URL, refreshAccessToken } from "@/lib/api-client";
import { getAuthTokens } from "@/lib/cookies";
import type { ApiEnvelope } from "@/types/auth.types";
import type {
  ChatMessage,
  ChatSession,
  ChatSessionCreatePayload,
  ListChatSessionsParams,
} from "@/types/chat.types";

export async function listChatSessions(params: ListChatSessionsParams = {}): Promise<ChatSession[]> {
  const { data } = await apiClient.get<ApiEnvelope<ChatSession[]>>("/chat/sessions/", {
    params: { skip: params.skip ?? 0, limit: params.limit ?? 20 },
  });
  return data.data;
}

export async function createChatSession(payload: ChatSessionCreatePayload = {}): Promise<ChatSession> {
  const { data } = await apiClient.post<ApiEnvelope<ChatSession>>("/chat/sessions", payload);
  return data.data;
}

export async function deleteChatSession(sessionId: string): Promise<void> {
  await apiClient.delete(`/chat/sessions/${sessionId}`);
}

export async function getChatMessages(sessionId: string): Promise<ChatMessage[]> {
  const { data } = await apiClient.get<ApiEnvelope<ChatMessage[]>>(`/chat/sessions/${sessionId}`);
  return data.data;
}

interface StreamChatMessageHandlers {
  onDelta: (text: string) => void;
  onError: (message: string) => void;
  onDone: () => void;
  signal?: AbortSignal;
}

async function openStream(sessionId: string, content: string, accessToken: string | undefined, signal?: AbortSignal) {
  return fetch(`${API_BASE_URL}/chat/sessions/${sessionId}/messages/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify({ content }),
    signal,
  });
}

// Bypasses apiClient deliberately: EventSource can't send a POST body or a
// custom Authorization header, so this is a raw fetch() reading the response
// body as a stream instead of the usual axios instance. Because it's outside
// axios, it can't rely on apiClient's response interceptor for 401 handling
// — a 401 here is handled explicitly: refresh once, retry the stream once.
export async function streamChatMessage(
  sessionId: string,
  content: string,
  handlers: StreamChatMessageHandlers
): Promise<void> {
  const { accessToken } = getAuthTokens();
  let response = await openStream(sessionId, content, accessToken, handlers.signal);

  if (response.status === 401) {
    try {
      const tokens = await refreshAccessToken();
      response = await openStream(sessionId, content, tokens.access_token, handlers.signal);
    } catch {
      handlers.onError("Your session expired. Please log in again.");
      return;
    }
  }

  if (!response.ok || !response.body) {
    handlers.onError("Failed to get a response, please try again.");
    return;
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop() ?? "";

    for (const event of events) {
      const line = event.trim();
      if (!line.startsWith("data:")) continue;

      const payload = line.slice("data:".length).trim();
      if (payload === "[DONE]") {
        handlers.onDone();
        return;
      }

      const parsed = JSON.parse(payload) as { delta?: string; error?: string };
      if (parsed.error) {
        handlers.onError(parsed.error);
        return;
      }
      if (parsed.delta) {
        handlers.onDelta(parsed.delta);
      }
    }
  }

  handlers.onDone();
}
