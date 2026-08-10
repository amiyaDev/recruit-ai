import type { Metadata } from "next";

import { InterviewSetupForm } from "@/components/interviews/interview-setup-form";

export const metadata: Metadata = {
  title: "Interviews - RecruitAI",
};

export default async function InterviewsPage({ searchParams }: PageProps<"/interviews">) {
  const params = await searchParams;
  const resumeId = typeof params.resumeId === "string" ? params.resumeId : undefined;
  const jobId = typeof params.jobId === "string" ? params.jobId : undefined;

  return (
    <div className="flex flex-col gap-stack-lg">
      <header>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
          Interviews
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground mt-2">
          Practice technical and behavioral questions tailored to your resume and target role.
        </p>
      </header>

      <InterviewSetupForm initialResumeId={resumeId} initialJobId={jobId} />
    </div>
  );
}
