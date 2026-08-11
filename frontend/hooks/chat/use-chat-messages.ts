"use client";

import { useQuery } from "@tanstack/react-query";

import { getChatMessages } from "@/services/chat.service";

export const chatMessagesQueryKey = (sessionId: string) => ["chat", "messages", sessionId] as const;

export function useChatMessages(sessionId: string) {
  return useQuery({
    queryKey: chatMessagesQueryKey(sessionId),
    queryFn: () => getChatMessages(sessionId),
    enabled: Boolean(sessionId),
    retry: false,
  });
}
