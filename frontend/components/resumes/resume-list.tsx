"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useResumes } from "@/hooks/resumes/use-resumes";

function fileIcon(filename: string) {
  return filename.toLowerCase().endsWith(".pdf") ? "picture_as_pdf" : "description";
}

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

export function ResumeList() {
  const { data: resumes, isLoading, isError, error } = useResumes();

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
    return <FormError message={getApiErrorMessage(error, "Couldn't load your resumes.")} />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-md">
      {resumes && resumes.length === 0 && (
        <div className="md:col-span-2 xl:col-span-3 shadcn-card rounded-xl p-stack-lg flex flex-col items-center text-center gap-3 py-16">
          <span className="material-symbols-outlined text-primary text-[40px]">description</span>
          <p className="font-body-md text-sm font-semibold text-foreground">No resumes yet</p>
          <p className="font-body-md text-sm text-muted-foreground max-w-sm">
            Upload your first resume to get AI-parsed skills and start running ATS analysis.
          </p>
        </div>
      )}

      {resumes?.map((resume) => (
        <Link
          key={resume.id}
          href={`/resumes/${resume.id}`}
          className="shadcn-card rounded-xl p-stack-md flex flex-col gap-stack-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[22px]">{fileIcon(resume.filename)}</span>
            </div>
            <StatusBadge status={resume.status} />
          </div>
          <div>
            <p className="font-body-md text-sm font-semibold text-foreground line-clamp-2">{resume.filename}</p>
            <p className="font-body-md text-xs text-muted-foreground mt-1">
              {new Date(resume.created_at).toLocaleDateString()}
            </p>
          </div>
          {resume.status === "failed" && (
            <p className="font-body-md text-xs text-destructive mt-1">
              Extraction failed — try re-uploading a text-based PDF.
            </p>
          )}
          {resume.status === "parsing" && (
            <p className="font-body-md text-xs text-primary mt-1 flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
              Parsing in progress…
            </p>
          )}
        </Link>
      ))}

      <Link
        href="/resumes/upload"
        className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 p-stack-md min-h-[160px] text-muted-foreground hover:text-primary transition-colors"
      >
        <span className="material-symbols-outlined text-[28px]">add_circle</span>
        <span className="font-body-md text-sm font-medium">Upload another resume</span>
      </Link>
    </div>
  );
}
