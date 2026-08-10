import Link from "next/link";
import type { Metadata } from "next";

import { JobForm } from "@/components/jobs/job-form";

export const metadata: Metadata = {
  title: "New Job Description - RecruitAI",
};

export default function NewJobPage() {
  return (
    <div className="flex flex-col gap-stack-lg max-w-3xl">
      <Link
        href="/jobs"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to jobs
      </Link>

      <header>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
          Add a job description
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground mt-2">
          Paste a job description and we&apos;ll extract keywords automatically for ATS matching.
        </p>
      </header>

      <JobForm />
    </div>
  );
}
