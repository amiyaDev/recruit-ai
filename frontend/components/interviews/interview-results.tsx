"use client";

import { useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";

import { cn } from "@/lib/utils";
import { ScoreRing } from "@/components/dashboard/score-ring";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { QUESTION_TYPE_META } from "@/constants/interview";
import { useInterview } from "@/hooks/interviews/use-interview";
import { useJob } from "@/hooks/jobs/use-job";
import { useResume } from "@/hooks/resumes/use-resume";
import { useGenerateInterview } from "@/hooks/interviews/use-generate-interview";
import type { InterviewQuestion } from "@/types/interview.types";

function scoreSummary(score: number) {
  if (score >= 85) return "Excellent performance — you're well prepared for this kind of interview.";
  if (score >= 70) return "Solid performance, with a few areas worth tightening up before the real thing.";
  if (score >= 50) return "A reasonable start — review the feedback below and try another session.";
  return "This is a good baseline. Focus on the feedback below and practice again.";
}

// Traffic-light bands for a 0-10 per-question score, reusing existing design
// tokens (tertiary=green, warning=amber, destructive=red) rather than
// introducing new colors.
function getScoreBand(score: number) {
  if (score >= 8) {
    return {
      label: "Strong",
      text: "text-tertiary dark:text-tertiary-fixed-dim",
      chipBg: "bg-tertiary-container/10",
      border: "border-tertiary-container/30",
      dot: "bg-tertiary dark:bg-tertiary-fixed-dim",
    };
  }
  if (score >= 5) {
    return {
      label: "Good",
      text: "text-warning",
      chipBg: "bg-warning/10",
      border: "border-warning/30",
      dot: "bg-warning",
    };
  }
  return {
    label: "Needs work",
    text: "text-destructive",
    chipBg: "bg-destructive/10",
    border: "border-destructive/30",
    dot: "bg-destructive",
  };
}

function QuestionAccordionItem({ question, index }: { question: InterviewQuestion; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasScore = typeof question.score === "number";
  const band = hasScore ? getScoreBand(question.score as number) : null;
  const typeMeta = QUESTION_TYPE_META[question.question_type];

  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden transition-colors",
        band ? band.border : "border-border"
      )}
    >
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-expanded={isOpen}
        className="w-full flex items-start gap-3 p-stack-md text-left hover:bg-muted/40 transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-muted text-muted-foreground text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-body-md text-sm font-semibold text-foreground leading-snug">{question.question_text}</p>
          <span className="inline-flex items-center gap-1 mt-1.5 font-label-sm text-[11px] text-muted-foreground">
            <span className="material-symbols-outlined text-[13px]">{typeMeta?.icon ?? "help"}</span>
            {typeMeta?.label ?? question.question_type}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {hasScore && band ? (
            <span className={cn("px-2.5 py-1 rounded-full font-label-sm text-xs font-bold", band.chipBg, band.text)}>
              {question.score}/10
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full font-label-sm text-xs font-medium bg-muted text-muted-foreground">
              Not scored
            </span>
          )}
          <span
            className={cn(
              "material-symbols-outlined text-muted-foreground transition-transform duration-200",
              isOpen && "rotate-180"
            )}
          >
            expand_more
          </span>
        </div>
      </button>

      {isOpen && (
        <div className="px-stack-md pb-stack-md flex flex-col gap-3 border-t border-border pt-stack-md">
          {question.user_answer ? (
            <div className="p-3 rounded-lg bg-muted/40">
              <p className="font-label-sm text-[11px] text-muted-foreground uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">person</span>
                Your answer
              </p>
              <p className="font-body-md text-sm text-foreground leading-relaxed">{question.user_answer}</p>
            </div>
          ) : (
            <p className="font-body-md text-sm text-muted-foreground italic">Not answered.</p>
          )}

          {question.ai_feedback && (
            <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
              <p className="font-label-sm text-[11px] text-primary uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                Feedback
              </p>
              <p className="font-body-md text-sm text-foreground leading-relaxed">{question.ai_feedback}</p>
            </div>
          )}

          {question.ideal_answer && (
            <div className="p-3 rounded-lg bg-tertiary-container/10 border border-tertiary-container/20">
              <p className="font-label-sm text-[11px] text-tertiary dark:text-tertiary-fixed-dim uppercase tracking-wide mb-1.5 flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">school</span>
                Suggested answer
              </p>
              <p className="font-body-md text-sm text-foreground leading-relaxed">{question.ideal_answer}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function InterviewResults({ id }: { id: string }) {
  const { data: session, isLoading, isError, error } = useInterview(id);
  const { data: job } = useJob(session?.job_id ?? "");
  const { data: resume } = useResume(session?.resume_id ?? "");

  const generate = useGenerateInterview();

  function handleRetake() {
    generate.mutate({
      resume_id: session!.resume_id ?? undefined,
      job_id: session!.job_id ?? undefined,
      difficulty: session!.difficulty,
    });
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        <div className="h-10 w-1/2 rounded bg-muted animate-pulse" />
        <div className="shadcn-card rounded-xl p-stack-lg h-64 animate-pulse" />
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

  if (session.status !== "completed") {
    return (
      <div className="flex flex-col gap-stack-lg">
        <Link
          href="/interviews"
          className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to interviews
        </Link>
        <div className="shadcn-card rounded-xl p-stack-lg flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-[24px]">info</span>
          <div>
            <p className="font-body-md text-sm font-semibold text-foreground">This session isn&apos;t finished yet</p>
            <p className="font-body-md text-sm text-muted-foreground mt-1">
              Finish answering and evaluate it to see your debrief.
            </p>
          </div>
          <Link href={`/interviews/${id}`} className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 ml-auto">
            Resume session
          </Link>
        </div>
      </div>
    );
  }

  const overallScore = session.overall_score ?? 0;
  const scoredQuestions = session.questions.filter((q) => typeof q.score === "number");
  const strongCount = scoredQuestions.filter((q) => (q.score as number) >= 8).length;
  const goodCount = scoredQuestions.filter((q) => (q.score as number) >= 5 && (q.score as number) < 8).length;
  const weakCount = scoredQuestions.filter((q) => (q.score as number) < 5).length;

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        href="/interviews"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to interviews
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-stack-sm">
        <div>
          <p className="font-label-sm text-label-sm text-primary uppercase mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">task_alt</span>
            Session complete
          </p>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
            {job?.title ?? "Interview practice"} debrief
          </h2>
          <p className="font-body-md text-sm text-muted-foreground mt-2">
            {resume?.filename ?? "No resume attached"} &middot; {session.questions.length} questions &middot;{" "}
            <span className="capitalize">{session.difficulty}</span> difficulty
          </p>
        </div>
        <button
          type="button"
          onClick={handleRetake}
          disabled={generate.isPending}
          className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 w-fit disabled:opacity-60 disabled:pointer-events-none"
        >
          <span className={`material-symbols-outlined text-[18px] ${generate.isPending ? "animate-spin" : ""}`}>
            {generate.isPending ? "progress_activity" : "replay"}
          </span>
          {generate.isPending ? "Starting…" : "Retake this interview"}
        </button>
      </header>
      {generate.isError && <FormError message={getApiErrorMessage(generate.error)} />}

      {/* Overall score — full-width horizontal band instead of a side column */}
      <div className="shadcn-card rounded-xl p-stack-lg flex flex-col sm:flex-row items-center gap-stack-lg">
        <ScoreRing score={Math.round(overallScore * 10)} size={140} label="out of 100" gradientId="interview-score-ring" />
        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left gap-stack-sm">
          <h3 className="font-headline-md text-headline-md text-foreground">Overall score</h3>
          <p className="font-body-md text-sm text-muted-foreground">{scoreSummary(overallScore * 10)}</p>

          {scoredQuestions.length > 0 && (
            <div className="flex items-center flex-wrap justify-center sm:justify-start gap-x-4 gap-y-1.5 pt-stack-sm mt-stack-sm border-t border-border w-full font-label-sm text-xs">
              <span className="flex items-center gap-1.5 text-tertiary dark:text-tertiary-fixed-dim">
                <span className="w-2 h-2 rounded-full bg-tertiary dark:bg-tertiary-fixed-dim" />
                {strongCount} strong
              </span>
              <span className="flex items-center gap-1.5 text-warning">
                <span className="w-2 h-2 rounded-full bg-warning" />
                {goodCount} good
              </span>
              <span className="flex items-center gap-1.5 text-destructive">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                {weakCount} needs work
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Per-question feedback — full-width rows, stacked top to bottom */}
      <div className="shadcn-card rounded-xl p-stack-lg">
        <div className="flex items-center justify-between mb-stack-md">
          <h3 className="font-headline-md text-headline-md text-foreground">Per-question feedback</h3>
          <span className="font-label-sm text-[11px] text-muted-foreground">Tap a question to expand</span>
        </div>
        <div className="flex flex-col gap-stack-sm">
          {session.questions.map((q, i) => (
            <QuestionAccordionItem key={q.id} question={q} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
