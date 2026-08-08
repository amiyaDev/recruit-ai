import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ScoreRing } from "@/components/dashboard/score-ring";
import { getInterviewById, getJobById, getResumeById } from "@/constants/dashboard-mock-data";

export async function generateMetadata({
  params,
}: PageProps<"/interviews/[id]/results">): Promise<Metadata> {
  const { id } = await params;
  return { title: getInterviewById(id) ? "Interview Results - RecruitAI" : "Interview - RecruitAI" };
}

export default async function InterviewResultsPage({ params }: PageProps<"/interviews/[id]/results">) {
  const { id } = await params;
  const session = getInterviewById(id);
  if (!session) notFound();

  const job = session.jobId ? getJobById(session.jobId) : undefined;
  const resume = session.resumeId ? getResumeById(session.resumeId) : undefined;
  const answered = session.questions.filter((q) => q.userAnswer);
  const avgQuestionScore =
    answered.length > 0
      ? Math.round(answered.reduce((sum, q) => sum + (q.score ?? 0), 0) / answered.length)
      : undefined;
  const overallScore = session.overallScore ?? avgQuestionScore ?? 0;

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
          <ScoreRing score={overallScore} size={200} label="out of 100" gradientId="interview-score-ring" />
          {session.overallSummary && (
            <p className="font-body-md text-sm text-center text-muted-foreground mt-stack-lg">
              {session.overallSummary}
            </p>
          )}
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
                    {i + 1}. {q.questionText}
                  </p>
                  {typeof q.score === "number" && (
                    <span className="font-headline-md text-sm font-bold text-tertiary shrink-0">
                      {q.score}
                    </span>
                  )}
                </div>
                {q.userAnswer ? (
                  <>
                    <p className="font-body-md text-sm text-muted-foreground italic mb-2">
                      &ldquo;{q.userAnswer}&rdquo;
                    </p>
                    {q.aiFeedback && (
                      <p className="font-body-md text-sm text-foreground flex items-start gap-2">
                        <span className="material-symbols-outlined text-primary text-[18px] shrink-0 mt-0.5">
                          auto_awesome
                        </span>
                        {q.aiFeedback}
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
