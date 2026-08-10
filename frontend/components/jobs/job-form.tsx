"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { jobSchema, type JobFormValues } from "@/schemas/job.schema";
import { useCreateJob } from "@/hooks/jobs/use-create-job";

export function JobForm() {
  const createJob = useCreateJob();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JobFormValues>({
    resolver: yupResolver(jobSchema),
    mode: "onBlur",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => createJob.mutate(values))}
      className="shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md"
      noValidate
    >
      <FormError message={createJob.isError ? getApiErrorMessage(createJob.error) : null} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-title">
            Job title
          </label>
          <input
            id="job-title"
            type="text"
            placeholder="e.g. Senior Frontend Engineer"
            aria-invalid={Boolean(errors.title)}
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all aria-invalid:border-destructive"
            {...register("title")}
          />
          {errors.title && <p className="font-label-sm text-label-sm text-destructive">{errors.title.message}</p>}
        </div>
        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-company">
            Company <span className="text-muted-foreground/60">(optional)</span>
          </label>
          <input
            id="job-company"
            type="text"
            placeholder="e.g. Northwind Labs"
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            {...register("company")}
          />
        </div>
      </div>

      <div className="space-y-stack-sm">
        <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-description">
          Job description
        </label>
        <textarea
          id="job-description"
          rows={10}
          placeholder="Paste the full job description here..."
          aria-invalid={Boolean(errors.description)}
          className="w-full bg-muted/50 border border-border rounded-lg py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none aria-invalid:border-destructive"
          {...register("description")}
        />
        {errors.description && (
          <p className="font-label-sm text-label-sm text-destructive">{errors.description.message}</p>
        )}
      </div>

      <div className="flex items-center justify-end gap-3 pt-stack-sm border-t border-border">
        <Link
          href="/jobs"
          className="font-label-sm text-sm text-muted-foreground hover:text-foreground px-4 py-2.5 transition-colors"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={createJob.isPending}
          className="shadcn-btn-primary font-label-sm text-sm px-6 py-2.5 flex items-center gap-2 disabled:opacity-60 disabled:pointer-events-none"
        >
          <span className={`material-symbols-outlined text-[18px] ${createJob.isPending ? "animate-spin" : ""}`}>
            {createJob.isPending ? "progress_activity" : "auto_awesome"}
          </span>
          {createJob.isPending ? "Extracting keywords…" : "Extract keywords & save"}
        </button>
      </div>
    </form>
  );
}
