"use client";

import Link from "next/link";
import { isAxiosError } from "axios";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { DeleteJobButton } from "@/components/dashboard/delete-job-button";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useJob } from "@/hooks/jobs/use-job";

export function JobDetail({ id }: { id: string }) {
  const { data: job, isLoading, isError, error } = useJob(id);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack-lg">
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
        <div className="flex items-start gap-4 animate-pulse">
          <div className="w-14 h-14 rounded-xl bg-muted shrink-0" />
          <div className="flex flex-col gap-2 flex-1">
            <div className="h-6 w-1/2 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
          </div>
        </div>
        <div className="shadcn-card rounded-xl p-stack-lg h-40 animate-pulse" />
      </div>
    );
  }

  if (isError || !job) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="flex flex-col gap-stack-lg">
        <Link
          href="/jobs"
          className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to jobs
        </Link>
        <FormError
          message={notFound ? "This job doesn't exist or you don't have access to it." : getApiErrorMessage(error)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        href="/jobs"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to jobs
      </Link>

      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">work</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
              {job.title}
            </h2>
            <p className="font-body-md text-sm text-muted-foreground mt-1">
              {job.company ?? "No company specified"} &middot; Added{" "}
              {new Date(job.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          <Link
            href={`/ats?jobId=${job.id}`}
            className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
            Run ATS analysis
          </Link>
          <DeleteJobButton id={job.id} title={job.title} />
        </div>
      </header>

      {job.status === "failed" && (
        <div className="shadcn-card rounded-xl p-stack-lg flex items-start gap-4 border-l-4 border-destructive">
          <span className="material-symbols-outlined text-destructive text-[24px]">error</span>
          <p className="font-body-md text-sm text-muted-foreground">
            Keyword extraction failed for this job description. You can delete it and try adding it again.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <section className="lg:col-span-2 shadcn-card rounded-xl p-stack-lg">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">Job description</h3>
          <p className="font-body-md text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </section>

        <section className="shadcn-card rounded-xl p-stack-lg h-fit">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">Extracted keywords</h3>
          {job.status === "pending" || job.status === "processing" ? (
            <p className="font-body-md text-sm text-muted-foreground flex items-center gap-2">
              <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
              Keyword extraction is still processing for this job.
            </p>
          ) : job.extracted_keywords && job.extracted_keywords.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {job.extracted_keywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-label-sm text-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          ) : (
            <p className="font-body-md text-sm text-muted-foreground">
              No keywords from our curated skill list were found in this description.
            </p>
          )}
        </section>
      </div>
    </div>
  );
}
