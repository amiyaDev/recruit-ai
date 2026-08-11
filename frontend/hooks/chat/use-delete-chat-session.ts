"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteChatSession } from "@/services/chat.service";
import { CHAT_SESSIONS_QUERY_KEY } from "@/hooks/chat/use-chat-sessions";

export function useDeleteChatSession() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteChatSession(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_QUERY_KEY });
    },
  });
}
