"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

import { answerQuestion } from "@/services/interview.service";
import type { InterviewAnswerPayload, InterviewSession } from "@/types/interview.types";

export function useAnswerQuestion(sessionId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: InterviewAnswerPayload) => answerQuestion(sessionId, payload),
    onSuccess: (_data, payload) => {
      queryClient.setQueryData<InterviewSession | undefined>(["interviews", sessionId], (old) => {
        if (!old) return old;
        return {
          ...old,
          questions: old.questions.map((q) =>
            q.id === payload.question_id ? { ...q, user_answer: payload.answer } : q
          ),
        };
      });
    },
  });
}
