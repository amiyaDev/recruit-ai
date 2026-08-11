"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { streamChatMessage } from "@/services/chat.service";
import { chatMessagesQueryKey } from "@/hooks/chat/use-chat-messages";
import { CHAT_SESSIONS_QUERY_KEY } from "@/hooks/chat/use-chat-sessions";
import type { ChatMessage } from "@/types/chat.types";

export function useChatStream(sessionId: string) {
  const queryClient = useQueryClient();
  const [streamingText, setStreamingText] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cancel an in-flight stream if the user navigates away mid-reply.
  useEffect(() => () => abortRef.current?.abort(), []);

  const sendMessage = useCallback(
    async (content: string) => {
      setError(null);
      setStreamingText("");
      setIsStreaming(true);

      const optimisticUserMessage: ChatMessage = {
        id: `temp-${Date.now()}`,
        role: "user",
        content,
        created_at: new Date().toISOString(),
      };
      queryClient.setQueryData<ChatMessage[]>(chatMessagesQueryKey(sessionId), (old) => [
        ...(old ?? []),
        optimisticUserMessage,
      ]);

      const controller = new AbortController();
      abortRef.current = controller;
      let accumulated = "";

      await streamChatMessage(sessionId, content, {
        signal: controller.signal,
        onDelta: (delta) => {
          accumulated += delta;
          setStreamingText(accumulated);
        },
        onError: (message) => {
          setError(message);
          setIsStreaming(false);
        },
        onDone: () => {
          setIsStreaming(false);
          setStreamingText("");
          // Replaces the optimistic user message + streamed text with the
          // persisted rows (real ids) from the DB, and refreshes the
          // session list so a first message's auto-generated title shows up.
          queryClient.invalidateQueries({ queryKey: chatMessagesQueryKey(sessionId) });
          queryClient.invalidateQueries({ queryKey: CHAT_SESSIONS_QUERY_KEY });
        },
      });
    },
    [sessionId, queryClient]
  );

  return { streamingText, isStreaming, error, sendMessage };
}
