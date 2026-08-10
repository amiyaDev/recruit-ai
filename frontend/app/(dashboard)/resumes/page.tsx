import Link from "next/link";
import type { Metadata } from "next";

import { ResumeList } from "@/components/resumes/resume-list";

export const metadata: Metadata = {
  title: "Resumes - RecruitAI",
};

export default function ResumesPage() {
  return (
    <div className="flex flex-col gap-stack-lg">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-stack-sm">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
            Resumes
          </h2>
          <p className="font-body-md text-body-md text-muted-foreground mt-2">
            Every resume you&apos;ve uploaded, and what our AI engine extracted from it.
          </p>
        </div>
        <Link
          href="/resumes/upload"
          className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
          Upload resume
        </Link>
      </header>

      <ResumeList />
    </div>
  );
}
