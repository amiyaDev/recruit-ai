import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { ScoreRing } from "@/components/dashboard/score-ring";
import { getAtsScoreById, getJobById, getResumeById } from "@/constants/dashboard-mock-data";

export async function generateMetadata({
  params,
}: PageProps<"/ats/[id]">): Promise<Metadata> {
  const { id } = await params;
  const score = getAtsScoreById(id);
  const job = score ? getJobById(score.jobId) : undefined;
  return { title: job ? `${job.title} ATS Result - RecruitAI` : "ATS Result - RecruitAI" };
}

function scoreLabel(score: number) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Strong match";
  if (score >= 50) return "Needs work";
  return "Weak match";
}

export default async function AtsResultPage({ params }: PageProps<"/ats/[id]">) {
  const { id } = await params;
  const score = getAtsScoreById(id);
  if (!score) notFound();

  const job = getJobById(score.jobId);
  const resume = getResumeById(score.resumeId);

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
            {job?.title}
          </h2>
          <p className="font-body-md text-sm text-muted-foreground mt-2">
            {resume?.filename} &middot; Analyzed {new Date(score.createdAt).toLocaleDateString()}
          </p>
        </div>
        <button
          type="button"
          className="shadcn-btn-outline font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">download</span>
          Download report
        </button>
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
                {score.missingKeywords.length} found
              </span>
            </div>
            {score.missingKeywords.length === 0 ? (
              <p className="font-body-md text-sm text-muted-foreground">
                No missing keywords — this resume covers everything the job description calls for.
              </p>
            ) : (
              <div className="flex flex-wrap gap-3">
                {score.missingKeywords.map((kw) => (
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
            <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
              AI suggestions
            </h3>
            <div className="flex flex-col gap-3">
              {score.suggestions.map((suggestion) => (
                <div
                  key={suggestion.title}
                  className="p-stack-md rounded-lg border border-border bg-muted/30 hover:bg-muted/60 transition-colors flex gap-4 items-start"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-secondary">{suggestion.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-body-md text-sm font-semibold text-foreground mb-1">
                      {suggestion.title}
                    </h4>
                    <p className="font-body-md text-sm text-muted-foreground">{suggestion.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
