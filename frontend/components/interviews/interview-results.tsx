"use client";

import Link from "next/link";
import { isAxiosError } from "axios";

import { ScoreRing } from "@/components/dashboard/score-ring";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useInterview } from "@/hooks/interviews/use-interview";
import { useJob } from "@/hooks/jobs/use-job";
import { useResume } from "@/hooks/resumes/use-resume";

function scoreSummary(score: number) {
  if (score >= 85) return "Excellent performance — you're well prepared for this kind of interview.";
  if (score >= 70) return "Solid performance, with a few areas worth tightening up before the real thing.";
  if (score >= 50) return "A reasonable start — review the feedback below and try another session.";
  return "This is a good baseline. Focus on the feedback below and practice again.";
}

export function InterviewResults({ id }: { id: string }) {
  const { data: session, isLoading, isError, error } = useInterview(id);
  const { data: job } = useJob(session?.job_id ?? "");
  const { data: resume } = useResume(session?.resume_id ?? "");

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

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        href="/interviews"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to interviews
      </Link>

      <header>
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
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <div className="shadcn-card rounded-xl p-stack-lg flex flex-col items-center justify-center lg:col-span-1">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-lg self-start">
            Overall score
          </h3>
          <ScoreRing score={Math.round(overallScore * 10)} size={200} label="out of 100" gradientId="interview-score-ring" />
          <p className="font-body-md text-sm text-center text-muted-foreground mt-stack-lg">
            {scoreSummary(overallScore * 10)}
          </p>
        </div>

        <div className="lg:col-span-2 shadcn-card rounded-xl p-stack-lg">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
            Per-question feedback
          </h3>
          <div className="flex flex-col gap-stack-md">
            {session.questions.map((q, i) => (
              <div key={q.id} className="p-stack-md rounded-lg border border-border bg-muted/30">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <p className="font-body-md text-sm font-semibold text-foreground">
                    {i + 1}. {q.question_text}
                  </p>
                  {typeof q.score === "number" && (
                    <span className="font-headline-md text-sm font-bold text-tertiary shrink-0">
                      {q.score}/10
                    </span>
                  )}
                </div>
                {q.user_answer ? (
                  <>
                    <p className="font-body-md text-sm text-muted-foreground italic mb-2">
                      &ldquo;{q.user_answer}&rdquo;
                    </p>
                    {q.ai_feedback && (
                      <p className="font-body-md text-sm text-foreground flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                          auto_awesome
                        </span>
                        {q.ai_feedback}
                      </p>
                    )}
                  </>
                ) : (
                  <p className="font-body-md text-sm text-muted-foreground">Not answered.</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
