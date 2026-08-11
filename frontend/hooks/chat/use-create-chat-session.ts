"use client";

import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createChatSession } from "@/services/chat.service";
import { CHAT_SESSIONS_QUERY_KEY } from "@/hooks/chat/use-chat-sessions";
import type { ChatSessionCreatePayload } from "@/types/chat.types";

export function useCreateChatSession() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ChatSessionCreatePayload = {}) => createChatSession(payload),
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_QUERY_KEY });
      router.push(`/chat/${session.id}`);
    },
  });
}
