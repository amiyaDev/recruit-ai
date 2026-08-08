import Link from "next/link";
import type { Metadata } from "next";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { MOCK_JOBS } from "@/constants/dashboard-mock-data";

export const metadata: Metadata = {
  title: "Jobs - RecruitAI",
};

export default function JobsPage() {
  return (
    <div className="flex flex-col gap-stack-lg">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-stack-sm">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
            Jobs
          </h2>
          <p className="font-body-md text-body-md text-muted-foreground mt-2">
            Job descriptions you&apos;ve added, ready to match and score against your resumes.
          </p>
        </div>
        <Link
          href="/jobs/new"
          className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add</span>
          Add job description
        </Link>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-md">
        {MOCK_JOBS.map((job) => (
          <Link
            key={job.id}
            href={`/jobs/${job.id}`}
            className="shadcn-card rounded-xl p-stack-md flex flex-col gap-stack-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-11 h-11 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">work</span>
              </div>
              <StatusBadge status={job.status} />
            </div>
            <div>
              <p className="font-body-md text-sm font-semibold text-foreground line-clamp-1">{job.title}</p>
              {job.company && (
                <p className="font-body-md text-xs text-muted-foreground mt-1">{job.company}</p>
              )}
            </div>
            <p className="font-body-md text-xs text-muted-foreground line-clamp-2">{job.description}</p>
            {job.extractedKeywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {job.extractedKeywords.slice(0, 3).map((kw) => (
                  <span
                    key={kw}
                    className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-label-sm text-[11px]"
                  >
                    {kw}
                  </span>
                ))}
                {job.extractedKeywords.length > 3 && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-label-sm text-[11px]">
                    +{job.extractedKeywords.length - 3}
                  </span>
                )}
              </div>
            )}
          </Link>
        ))}

        <Link
          href="/jobs/new"
          className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 p-stack-md min-h-[160px] text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">add_circle</span>
          <span className="font-body-md text-sm font-medium">Add another job</span>
        </Link>
      </div>
    </div>
  );
}
