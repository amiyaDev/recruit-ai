"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { isAxiosError } from "axios";

import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { QUESTION_TYPE_META } from "@/constants/interview";
import { useInterview } from "@/hooks/interviews/use-interview";
import { useAnswerQuestion } from "@/hooks/interviews/use-answer-question";
import { useEvaluateInterview } from "@/hooks/interviews/use-evaluate-interview";

export function InterviewPractice({ id }: { id: string }) {
  const router = useRouter();
  const { data: session, isLoading, isError, error } = useInterview(id);
  const answerQuestion = useAnswerQuestion(id);
  const evaluate = useEvaluateInterview(id);

  const [currentIndex, setCurrentIndex] = useState<number | null>(null);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  // Seed local state once the session loads: resume at the first unanswered
  // question, and hydrate drafts from any answers already saved server-side.
  useEffect(() => {
    if (session && currentIndex === null) {
      const firstUnanswered = session.questions.findIndex((q) => !q.user_answer);
      setCurrentIndex(firstUnanswered === -1 ? 0 : firstUnanswered);
      setDrafts(Object.fromEntries(session.questions.map((q) => [q.id, q.user_answer ?? ""])));
    }
  }, [session, currentIndex]);

  // A completed session has nothing left to practice — send the user to the debrief.
  useEffect(() => {
    if (session?.status === "completed") {
      router.replace(`/interviews/${id}/results`);
    }
  }, [session, id, router]);

  if (isLoading || (session && currentIndex === null)) {
    return (
      <div className="flex flex-col items-center gap-stack-lg">
        <div className="h-6 w-40 rounded bg-muted animate-pulse" />
        <div className="w-full max-w-4xl shadcn-card rounded-2xl p-stack-lg h-80 animate-pulse" />
      </div>
    );
  }

  if (isError || !session) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="flex flex-col gap-stack-lg">
        <Link
          href="/interviews"
          className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to interviews
        </Link>
        <FormError
          message={
            notFound ? "This interview session doesn't exist or you don't have access to it." : getApiErrorMessage(error)
          }
        />
      </div>
    );
  }

  if (session.status === "completed" || currentIndex === null) {
    return null;
  }

  const current = session.questions[currentIndex];
  const total = session.questions.length;
  const typeMeta = QUESTION_TYPE_META[current.question_type];
  const isLast = currentIndex === total - 1;
  const saving = answerQuestion.isPending || evaluate.isPending;

  async function persistCurrentAnswer() {
    const text = drafts[current.id]?.trim();
    if (text) {
      await answerQuestion.mutateAsync({ question_id: current.id, answer: text });
    }
  }

  async function handleNext() {
    await persistCurrentAnswer();
    setCurrentIndex((i) => Math.min((i ?? 0) + 1, total - 1));
  }

  function handlePrevious() {
    setCurrentIndex((i) => Math.max((i ?? 0) - 1, 0));
  }

  async function handleFinish() {
    await persistCurrentAnswer();
    await evaluate.mutateAsync();
    router.push(`/interviews/${id}/results`);
  }

  return (
    <div className="flex flex-col items-center gap-stack-lg">
      <header className="flex flex-col items-center text-center gap-stack-sm w-full">
        <Link
          href="/interviews"
          className="self-start font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Exit session
        </Link>
        <h2 className="font-headline-md text-headline-md text-primary tracking-tight mt-stack-sm">
          Question {currentIndex + 1} of {total}
        </h2>
        <div className="flex items-center gap-2 bg-muted/60 p-2 rounded-full border border-border">
          {session.questions.map((q, i) => (
            <div
              key={q.id}
              className={`w-8 h-2 rounded-full transition-colors ${
                i <= currentIndex ? "bg-gradient-to-r from-primary to-tertiary-fixed-dim" : "bg-border"
              }`}
            />
          ))}
        </div>
      </header>

      <div className="w-full max-w-4xl">
        {(answerQuestion.isError || evaluate.isError) && (
          <div className="mb-stack-md">
            <FormError message={getApiErrorMessage(answerQuestion.error ?? evaluate.error)} />
          </div>
        )}

        <div className="shadcn-card rounded-2xl p-stack-lg flex flex-col gap-stack-lg">
          <div className="flex justify-between items-start">
            <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-tertiary-container/10 border border-tertiary-container/20 text-tertiary font-label-sm text-label-sm gap-2">
              <span className="material-symbols-outlined text-[16px]">{typeMeta.icon}</span>
              {typeMeta.label}
            </span>
          </div>

          <h3 className="font-display-lg text-headline-lg-mobile md:text-headline-lg text-foreground leading-tight tracking-tight">
            &ldquo;{current.question_text}&rdquo;
          </h3>

          <div className="relative">
            <label className="sr-only" htmlFor="answer-input">
              Your answer
            </label>
            <textarea
              id="answer-input"
              rows={6}
              value={drafts[current.id] ?? ""}
              onChange={(e) => setDrafts((prev) => ({ ...prev, [current.id]: e.target.value }))}
              placeholder="Type your response here... (be sure to include context, action, and result)"
              className="w-full bg-muted/40 border border-border rounded-xl p-stack-md text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
            />
          </div>

          <div className="flex justify-between items-center pt-stack-sm border-t border-border">
            <button
              type="button"
              onClick={handlePrevious}
              disabled={currentIndex === 0 || saving}
              className="text-muted-foreground hover:text-primary disabled:opacity-40 disabled:pointer-events-none transition-colors font-label-sm text-sm uppercase tracking-wider flex items-center gap-2 py-2 px-4 rounded-lg hover:bg-muted"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Previous
            </button>
            {isLast ? (
              <button
                type="button"
                onClick={handleFinish}
                disabled={saving}
                className="px-8 py-3.5 rounded-xl shadcn-btn-primary font-label-sm text-sm uppercase tracking-widest flex items-center gap-3 font-bold disabled:opacity-60 disabled:pointer-events-none"
              >
                {evaluate.isPending ? "Evaluating…" : "Finish & evaluate"}
                <span
                  className={`material-symbols-outlined text-[20px] ${evaluate.isPending ? "animate-spin" : ""}`}
                >
                  {evaluate.isPending ? "progress_activity" : "check_circle"}
                </span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleNext}
                disabled={saving}
                className="px-8 py-3.5 rounded-xl shadcn-btn-primary font-label-sm text-sm uppercase tracking-widest flex items-center gap-3 font-bold disabled:opacity-60 disabled:pointer-events-none"
              >
                {answerQuestion.isPending ? "Saving…" : "Next question"}
                <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
              </button>
            )}
          </div>
        </div>

        <div className="mt-stack-lg text-center text-muted-foreground font-label-sm text-sm flex items-center justify-center gap-2">
          <span className="material-symbols-outlined text-[16px]">timer</span>
          Suggested time: 3-5 minutes
        </div>
      </div>
    </div>
  );
}
