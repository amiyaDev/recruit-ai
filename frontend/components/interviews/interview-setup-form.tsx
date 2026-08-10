"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { interviewGenerateSchema, type InterviewGenerateFormValues } from "@/schemas/interview.schema";
import { useGenerateInterview } from "@/hooks/interviews/use-generate-interview";
import { useInterviews } from "@/hooks/interviews/use-interviews";
import { useResumes } from "@/hooks/resumes/use-resumes";
import { useJobs } from "@/hooks/jobs/use-jobs";

const DIFFICULTIES: { value: "easy" | "medium" | "hard"; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export function InterviewSetupForm({
  initialResumeId,
  initialJobId,
}: {
  initialResumeId?: string;
  initialJobId?: string;
}) {
  const { data: resumes } = useResumes();
  const { data: jobs } = useJobs();
  const { data: sessions, isLoading, isError, error } = useInterviews();
  const generate = useGenerateInterview();

  const {
    register,
    handleSubmit,
  } = useForm<InterviewGenerateFormValues>({
    resolver: yupResolver(interviewGenerateSchema),
    defaultValues: {
      resumeId: initialResumeId ?? "",
      jobId: initialJobId ?? "",
      difficulty: "medium",
    },
  });

  const onSubmit = (values: InterviewGenerateFormValues) => {
    generate.mutate({
      resume_id: values.resumeId || undefined,
      job_id: values.jobId || undefined,
      difficulty: values.difficulty,
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="lg:col-span-1 shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md h-fit"
        noValidate
      >
        <h3 className="font-headline-md text-headline-md text-foreground">Start a session</h3>

        {generate.isError && <FormError message={getApiErrorMessage(generate.error)} />}

        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="interview-resume">
            Resume <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <select
            id="interview-resume"
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            {...register("resumeId")}
          >
            <option value="">None</option>
            {resumes?.map((resume) => (
              <option key={resume.id} value={resume.id}>
                {resume.filename}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="interview-job">
            Target job <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <select
            id="interview-job"
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            {...register("jobId")}
          >
            <option value="">None</option>
            {jobs?.map((job) => (
              <option key={job.id} value={job.id}>
                {job.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-stack-sm">
          <span className="block font-label-sm text-label-sm text-muted-foreground">Difficulty</span>
          <div className="grid grid-cols-3 gap-2">
            {DIFFICULTIES.map((d) => (
              <label
                key={d.value}
                className="flex items-center justify-center rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary cursor-pointer transition-colors"
              >
                <input type="radio" value={d.value} className="sr-only" {...register("difficulty")} />
                {d.label}
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={generate.isPending}
          className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 mt-stack-sm disabled:opacity-60 disabled:pointer-events-none"
        >
          <span className={`material-symbols-outlined text-[18px] ${generate.isPending ? "animate-spin" : ""}`}>
            {generate.isPending ? "progress_activity" : "auto_awesome"}
          </span>
          {generate.isPending ? "Generating…" : "Generate 5 questions"}
        </button>
      </form>

      <section className="lg:col-span-2 shadcn-card rounded-xl p-stack-lg">
        <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">Past sessions</h3>
        {isLoading ? (
          <div className="flex flex-col gap-3 animate-pulse">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-14 rounded-lg bg-muted" />
            ))}
          </div>
        ) : isError ? (
          <FormError message={getApiErrorMessage(error, "Couldn't load your interview sessions.")} />
        ) : !sessions || sessions.length === 0 ? (
          <p className="font-body-md text-sm text-muted-foreground">
            No interview sessions yet — start one to practice technical and behavioral questions.
          </p>
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {sessions.map((session) => {
              const job = session.job_id ? jobs?.find((j) => j.id === session.job_id) : undefined;
              const resume = session.resume_id ? resumes?.find((r) => r.id === session.resume_id) : undefined;
              const href =
                session.status === "completed" ? `/interviews/${session.id}/results` : `/interviews/${session.id}`;
              return (
                <Link
                  key={session.id}
                  href={href}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined">psychology</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-sm font-medium text-foreground truncate">
                      {job?.title ?? "General practice"}{" "}
                      <span className="text-muted-foreground font-normal capitalize">
                        &middot; {session.difficulty}
                      </span>
                    </p>
                    <p className="font-body-md text-xs text-muted-foreground mt-0.5">
                      {resume?.filename ?? "No resume attached"} &middot;{" "}
                      {new Date(session.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  {session.status === "completed" && typeof session.overall_score === "number" && (
                    <span className="font-headline-md text-sm font-bold text-tertiary">
                      {Math.round(session.overall_score)}
                    </span>
                  )}
                  <StatusBadge status={session.status} />
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
