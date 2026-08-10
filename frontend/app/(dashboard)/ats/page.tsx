import type { Metadata } from "next";

import { AtsAnalyzeForm } from "@/components/ats/ats-analyze-form";

export const metadata: Metadata = {
  title: "ATS Analysis - RecruitAI",
};

export default async function AtsPage({ searchParams }: PageProps<"/ats">) {
  const params = await searchParams;
  const resumeId = typeof params.resumeId === "string" ? params.resumeId : undefined;
  const jobId = typeof params.jobId === "string" ? params.jobId : undefined;

  return (
    <div className="flex flex-col gap-stack-lg">
      <header>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
          ATS Analysis
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground mt-2">
          Score a resume against a job description — keyword coverage, semantic match, and AI
          suggestions in one pass.
        </p>
      </header>

      <AtsAnalyzeForm initialResumeId={resumeId} initialJobId={jobId} />
    </div>
  );
}
