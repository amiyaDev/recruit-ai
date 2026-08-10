"use client";

import Link from "next/link";
import { isAxiosError } from "axios";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { DeleteResumeButton } from "@/components/dashboard/delete-resume-button";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useResume } from "@/hooks/resumes/use-resume";
import { useReparseResume } from "@/hooks/resumes/use-reparse-resume";
import { useAtsHistory } from "@/hooks/ats/use-ats-history";
import { useJobs } from "@/hooks/jobs/use-jobs";

function fileIcon(filename: string) {
  return filename.toLowerCase().endsWith(".pdf") ? "picture_as_pdf" : "description";
}

export function ResumeDetail({ id }: { id: string }) {
  const { data: resume, isLoading, isError, error } = useResume(id);
  const reparse = useReparseResume(id);
  const atsHistory = useAtsHistory(resume?.status === "parsed" ? id : undefined);
  const { data: jobs } = useJobs();

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

  if (isError || !resume) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="flex flex-col gap-stack-lg">
        <Link
          href="/resumes"
          className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to resumes
        </Link>
        <FormError
          message={notFound ? "This resume doesn't exist or you don't have access to it." : getApiErrorMessage(error)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        href="/resumes"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to resumes
      </Link>

      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">{fileIcon(resume.filename)}</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground break-all">
              {resume.filename}
            </h2>
            <p className="font-body-md text-sm text-muted-foreground mt-1">
              Uploaded {new Date(resume.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={resume.status} />
          <button
            type="button"
            onClick={() => reparse.mutate()}
            disabled={reparse.isPending}
            className="shadcn-btn-outline font-label-sm text-sm px-4 py-2 flex items-center gap-1.5 disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[16px] ${reparse.isPending ? "animate-spin" : ""}`}>
              refresh
            </span>
            {reparse.isPending ? "Re-parsing…" : "Re-parse"}
          </button>
          <DeleteResumeButton id={resume.id} filename={resume.filename} />
        </div>
      </header>

      {reparse.isError && <FormError message={getApiErrorMessage(reparse.error)} />}

      {resume.status === "failed" ? (
        <div className="shadcn-card rounded-xl p-stack-lg flex items-start gap-4 border-l-4 border-destructive">
          <span className="material-symbols-outlined text-destructive text-[24px]">error</span>
          <div>
            <p className="font-body-md text-sm font-semibold text-foreground">
              We couldn&apos;t extract any text from this file
            </p>
            <p className="font-body-md text-sm text-muted-foreground mt-1">
              This usually happens with scanned image-only PDFs. Try re-exporting the resume as a
              text-based PDF or DOCX, then re-upload or re-parse.
            </p>
          </div>
        </div>
      ) : resume.status === "parsing" || resume.status === "uploaded" ? (
        <div className="shadcn-card rounded-xl p-stack-lg flex items-center gap-4">
          <span className="material-symbols-outlined text-primary text-[24px] animate-spin">
            progress_activity
          </span>
          <p className="font-body-md text-sm text-muted-foreground">Parsing is still in progress…</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          <div className="lg:col-span-2 flex flex-col gap-stack-lg">
            <section className="shadcn-card rounded-xl p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
                Extracted contact info
              </h3>
              <div className="flex flex-col gap-stack-sm">
                <div className="flex items-center gap-stack-sm bg-muted/50 p-stack-sm rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <span className="font-body-md text-sm text-foreground">
                    {resume.parsed_data?.email ?? "Not detected"}
                  </span>
                </div>
                <div className="flex items-center gap-stack-sm bg-muted/50 p-stack-sm rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <span className="font-body-md text-sm text-foreground">
                    {resume.parsed_data?.phone ?? "Not detected"}
                  </span>
                </div>
              </div>
            </section>

            <section className="shadcn-card rounded-xl p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
                Detected skills ({resume.parsed_data?.skills.length ?? 0})
              </h3>
              {resume.parsed_data?.skills.length ? (
                <div className="flex flex-wrap gap-2">
                  {resume.parsed_data.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-sm"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="font-body-md text-sm text-muted-foreground">
                  No skills from our curated list were detected in this resume.
                </p>
              )}
            </section>
          </div>

          <div className="flex flex-col gap-stack-lg">
            <section className="shadcn-card rounded-xl p-stack-lg">
              <div className="flex items-center justify-between mb-stack-md">
                <h3 className="font-headline-md text-headline-md text-foreground">ATS history</h3>
                <Link href={`/ats?resumeId=${resume.id}`} className="font-label-sm text-xs text-primary hover:underline">
                  New analysis
                </Link>
              </div>
              {atsHistory.isLoading ? (
                <div className="flex flex-col gap-2 animate-pulse">
                  {Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className="h-12 rounded-lg bg-muted" />
                  ))}
                </div>
              ) : atsHistory.isError ? (
                <FormError message={getApiErrorMessage(atsHistory.error, "Couldn't load ATS history.")} />
              ) : !atsHistory.data || atsHistory.data.length === 0 ? (
                <p className="font-body-md text-sm text-muted-foreground">
                  No ATS analysis run against this resume yet.
                </p>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {atsHistory.data.map((score) => {
                    const job = jobs?.find((j) => j.id === score.job_id);
                    return (
                      <Link
                        key={score.id}
                        href={`/ats/${score.id}`}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-tertiary-container/10 text-tertiary flex items-center justify-center font-headline-md text-xs font-bold shrink-0">
                          {Math.round(score.score)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body-md text-sm font-medium text-foreground truncate">
                            {job?.title ?? "Job"}
                          </p>
                          <p className="font-body-md text-xs text-muted-foreground">{job?.company}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            <Link
              href={`/interviews?resumeId=${resume.id}`}
              className="shadcn-card rounded-xl p-stack-lg flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[20px]">psychology</span>
              </div>
              <div className="flex-1">
                <p className="font-body-md text-sm font-semibold text-foreground">Practice an interview</p>
                <p className="font-body-md text-xs text-muted-foreground mt-1">
                  Generate questions based on this resume
                </p>
              </div>
              <span className="material-symbols-outlined text-muted-foreground group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
