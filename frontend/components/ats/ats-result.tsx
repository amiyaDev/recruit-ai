"use client";

import Link from "next/link";
import { isAxiosError } from "axios";

import { ScoreRing } from "@/components/dashboard/score-ring";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useAtsScore } from "@/hooks/ats/use-ats-score";
import { useJob } from "@/hooks/jobs/use-job";
import { useResume } from "@/hooks/resumes/use-resume";

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong match";
  if (score >= 50) return "Needs work";
  return "Weak match";
}

export function AtsResult({ id }: { id: string }) {
  const { data: score, isLoading, isError, error } = useAtsScore(id);
  const { data: job } = useJob(score?.job_id ?? "");
  const { data: resume } = useResume(score?.resume_id ?? "");

  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <div className="h-4 w-40 rounded bg-muted animate-pulse" />
        <div className="h-10 w-1/2 rounded bg-muted animate-pulse" />
        <div className="shadcn-card rounded-xl p-stack-lg h-64 animate-pulse" />
      </div>
    );
  }

  if (isError || !score) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="flex flex-col gap-stack-lg">
        <Link
          href="/ats"
          className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to ATS analysis
        </Link>
        <FormError
          message={notFound ? "This ATS result doesn't exist or you don't have access to it." : getApiErrorMessage(error)}
        />
      </div>
    );
  }

  const missingKeywords = score.missing_keywords ?? [];
  const suggestions = score.suggestions ?? [];

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        href="/ats"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to ATS analysis
      </Link>

      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-stack-sm">
        <div>
          <p className="font-label-sm text-label-sm text-primary uppercase mb-2 flex items-center gap-2">
            <span className="material-symbols-outlined text-sm">auto_awesome</span>
            ATS analysis complete
          </p>
          <h2 className="font-display-lg text-headline-lg-mobile md:text-display-lg text-foreground">
            {job?.title ?? "Loading…"}
          </h2>
          <p className="font-body-md text-sm text-muted-foreground mt-2">
            {resume?.filename ?? "Loading…"} &middot; Analyzed {new Date(score.created_at).toLocaleDateString()}
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-md lg:gap-stack-lg">
        <div className="shadcn-card rounded-xl p-stack-lg flex flex-col items-center justify-center lg:col-span-1">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-lg self-start">
            Match score
          </h3>
          <ScoreRing score={Math.round(score.score)} size={220} label={scoreLabel(score.score)} />
          <p className="font-body-md text-sm text-center text-muted-foreground mt-stack-lg">
            {score.score >= 85
              ? "Your resume is highly optimized for this role. Minor tweaks suggested below."
              : score.score >= 60
              ? "A solid baseline match — closing the keyword gaps below will meaningfully improve it."
              : "This resume and job description don't overlap much yet. Consider the suggestions below or a different resume."}
          </p>
        </div>

        <div className="lg:col-span-2 flex flex-col gap-stack-md lg:gap-stack-lg">
          <div className="shadcn-card rounded-xl p-stack-lg">
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-headline-md text-headline-md text-foreground">Missing keywords</h3>
              <span className="font-label-sm text-label-sm px-3 py-1 rounded-full bg-destructive/10 text-destructive border border-destructive/20">
                {missingKeywords.length} found
              </span>
            </div>
            {missingKeywords.length === 0 ? (
              <p className="font-body-md text-sm text-muted-foreground">
                No missing keywords — this resume covers everything the job description calls for.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {missingKeywords.map((kw) => (
                  <span
                    key={kw}
                    className="px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-sm flex items-center gap-2"
                  >
                    <span className="material-symbols-outlined text-sm">add</span>
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="shadcn-card rounded-xl p-stack-lg flex-1">
            <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">AI suggestions</h3>
            {suggestions.length === 0 ? (
              <p className="font-body-md text-sm text-muted-foreground">No suggestions were generated.</p>
            ) : (
              <div className="flex flex-col gap-3">
                {suggestions.map((suggestion, i) => (
                  <div
                    key={i}
                    className="p-stack-md rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors flex gap-4 items-start"
                  >
                    <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                      <span className="material-symbols-outlined text-secondary text-[18px]">lightbulb</span>
                    </div>
                    <p className="font-body-md text-sm text-foreground">{suggestion}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
