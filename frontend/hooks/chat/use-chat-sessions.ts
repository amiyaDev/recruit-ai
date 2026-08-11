"use client";

import { useQuery } from "@tanstack/react-query";

import { listChatSessions } from "@/services/chat.service";
import type { ListChatSessionsParams } from "@/types/chat.types";

export const CHAT_SESSIONS_QUERY_KEY = ["chat", "sessions"] as const;

export function useChatSessions(params: ListChatSessionsParams = {}) {
  return useQuery({
    queryKey: [...CHAT_SESSIONS_QUERY_KEY, params],
    queryFn: () => listChatSessions(params),
  });
}
