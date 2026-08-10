"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { atsAnalyzeSchema, type AtsAnalyzeFormValues } from "@/schemas/ats.schema";
import { useAnalyzeAts } from "@/hooks/ats/use-analyze-ats";
import { useAtsHistory } from "@/hooks/ats/use-ats-history";
import { useResumes } from "@/hooks/resumes/use-resumes";
import { useJobs } from "@/hooks/jobs/use-jobs";

export function AtsAnalyzeForm({
  initialResumeId,
  initialJobId,
}: {
  initialResumeId?: string;
  initialJobId?: string;
}) {
  const { data: resumes, isLoading: resumesLoading } = useResumes();
  const { data: jobs, isLoading: jobsLoading } = useJobs();
  const analyze = useAnalyzeAts();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AtsAnalyzeFormValues>({
    resolver: yupResolver(atsAnalyzeSchema),
  });

  const selectedResumeId = watch("resumeId");
  const history = useAtsHistory(selectedResumeId);

  // Pre-select from ?resumeId=/?jobId= when arriving from a resume/job detail
  // page, falling back to the first item in each list once it loads — same
  // UX as a plain `defaultValue`, just async since the lists load over the wire.
  useEffect(() => {
    if (!resumes || resumes.length === 0 || selectedResumeId) return;
    const preselected = initialResumeId && resumes.some((r) => r.id === initialResumeId) ? initialResumeId : resumes[0].id;
    setValue("resumeId", preselected);
  }, [resumes, selectedResumeId, initialResumeId, setValue]);

  useEffect(() => {
    if (!jobs || jobs.length === 0 || watch("jobId")) return;
    const preselected = initialJobId && jobs.some((j) => j.id === initialJobId) ? initialJobId : jobs[0].id;
    setValue("jobId", preselected);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobs, initialJobId, setValue]);

  const noResumes = !resumesLoading && (!resumes || resumes.length === 0);
  const noJobs = !jobsLoading && (!jobs || jobs.length === 0);
  const blocked = noResumes || noJobs;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
      <form
        onSubmit={handleSubmit((values) => analyze.mutate({ resume_id: values.resumeId, job_id: values.jobId }))}
        className="lg:col-span-1 shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md h-fit"
        noValidate
      >
        <h3 className="font-headline-md text-headline-md text-foreground">New analysis</h3>

        {blocked && (
          <FormError
            message={
              noResumes && noJobs
                ? "Upload a resume and add a job description before running an analysis."
                : noResumes
                ? "Upload a resume before running an analysis."
                : "Add a job description before running an analysis."
            }
          />
        )}

        {analyze.isError && <FormError message={getApiErrorMessage(analyze.error)} />}

        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="resume-select">
            Resume
          </label>
          <select
            id="resume-select"
            disabled={noResumes}
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
            {...register("resumeId")}
          >
            {resumes?.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.filename}
              </option>
            ))}
          </select>
          {errors.resumeId && (
            <p className="font-label-sm text-label-sm text-destructive">{errors.resumeId.message}</p>
          )}
        </div>

        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-select">
            Job description
          </label>
          <select
            id="job-select"
            disabled={noJobs}
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all disabled:opacity-60"
            {...register("jobId")}
          >
            {jobs?.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title} {job.company ? `— ${job.company}` : ""}
              </option>
            ))}
          </select>
          {errors.jobId && <p className="font-label-sm text-label-sm text-destructive">{errors.jobId.message}</p>}
        </div>

        <button
          type="submit"
          disabled={blocked || analyze.isPending}
          className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 mt-stack-sm disabled:opacity-60 disabled:pointer-events-none"
        >
          <span className={`material-symbols-outlined text-[18px] ${analyze.isPending ? "animate-spin" : ""}`}>
            {analyze.isPending ? "progress_activity" : "auto_awesome"}
          </span>
          {analyze.isPending ? "Analyzing…" : "Analyze match"}
        </button>
      </form>

      <section className="lg:col-span-2 shadcn-card rounded-xl p-stack-lg">
        <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">Past analyses</h3>
        {!selectedResumeId ? (
          <p className="font-body-md text-sm text-muted-foreground">
            Select a resume to see its analysis history.
          </p>
        ) : history.isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted" />
            ))}
          </div>
        ) : history.isError ? (
          <FormError message={getApiErrorMessage(history.error, "Couldn't load analysis history.")} />
        ) : history.data && history.data.length === 0 ? (
          <p className="font-body-md text-sm text-muted-foreground">
            No ATS analysis run against this resume yet.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {history.data?.map((score) => {
              const job = jobs?.find((j) => j.id === score.job_id);
              return (
                <Link
                  key={score.id}
                  href={`/ats/${score.id}`}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-tertiary-container/10 text-tertiary flex items-center justify-center font-headline-md text-sm font-bold shrink-0">
                    {Math.round(score.score)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-sm font-medium text-foreground truncate">
                      {job?.title ?? "Job"}
                    </p>
                    <p className="font-body-md text-xs text-muted-foreground mt-0.5">
                      {new Date(score.created_at).toLocaleDateString()} &middot;{" "}
                      {score.missing_keywords?.length ?? 0} missing keyword
                      {(score.missing_keywords?.length ?? 0) === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                    chevron_right
                  </span>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
