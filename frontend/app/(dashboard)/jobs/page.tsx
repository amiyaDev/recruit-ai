import Link from "next/link";
import type { Metadata } from "next";

import { JobList } from "@/components/jobs/job-list";

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

      <JobList />
    </div>
  );
}
