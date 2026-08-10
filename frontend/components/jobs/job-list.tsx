"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useJobs } from "@/hooks/jobs/use-jobs";

function SkeletonCard() {
  return (
    <div className="shadcn-card rounded-xl p-stack-md flex flex-col gap-stack-sm animate-pulse">
      <div className="flex items-start justify-between gap-2">
        <div className="w-11 h-11 rounded-lg bg-muted" />
        <div className="h-5 w-16 rounded-full bg-muted" />
      </div>
      <div className="h-4 w-3/4 rounded bg-muted" />
      <div className="h-3 w-1/2 rounded bg-muted" />
    </div>
  );
}

export function JobList() {
  const { data: jobs, isLoading, isError, error } = useJobs();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-md">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (isError) {
    return <FormError message={getApiErrorMessage(error, "Couldn't load your jobs.")} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-md">
      {jobs && jobs.length === 0 && (
        <div className="md:col-span-2 xl:col-span-3 shadcn-card rounded-xl p-stack-lg flex flex-col items-center text-center gap-3 py-16">
          <span className="material-symbols-outlined text-secondary text-[40px]">work</span>
          <p className="font-body-md text-sm font-semibold text-foreground">No jobs yet</p>
          <p className="font-body-md text-sm text-muted-foreground max-w-sm">
            Add a job description to extract keywords and start running ATS analysis against your resumes.
          </p>
        </div>
      )}

      {jobs?.map((job) => (
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
            {job.company && <p className="font-body-md text-xs text-muted-foreground mt-1">{job.company}</p>}
          </div>
          <p className="font-body-md text-xs text-muted-foreground mt-1">
            {new Date(job.created_at).toLocaleDateString()}
          </p>
          {job.status === "failed" && (
            <p className="font-body-md text-xs text-destructive mt-1">Keyword extraction failed.</p>
          )}
          {job.status === "processing" && (
            <p className="font-body-md text-xs text-secondary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
              Extracting keywords…
            </p>
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
  );
}
