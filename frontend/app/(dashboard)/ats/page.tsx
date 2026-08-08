import Link from "next/link";
import type { Metadata } from "next";

import { MOCK_ATS_SCORES, MOCK_JOBS, MOCK_RESUMES, getJobById, getResumeById } from "@/constants/dashboard-mock-data";

export const metadata: Metadata = {
  title: "ATS Analysis - RecruitAI",
};

export default function AtsPage() {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <form className="lg:col-span-1 shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md h-fit">
          <h3 className="font-headline-md text-headline-md text-foreground">New analysis</h3>

          <div className="space-y-stack-sm">
            <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="resume-select">
              Resume
            </label>
            <select
              id="resume-select"
              defaultValue={MOCK_RESUMES[0]?.id}
              className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {MOCK_RESUMES.map((resume) => (
                <option key={resume.id} value={resume.id}>
                  {resume.filename}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-stack-sm">
            <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-select">
              Job description
            </label>
            <select
              id="job-select"
              defaultValue={MOCK_JOBS[0]?.id}
              className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              {MOCK_JOBS.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title} {job.company ? `— ${job.company}` : ""}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 mt-stack-sm"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Analyze match
          </button>
        </form>

        <section className="lg:col-span-2 shadcn-card rounded-xl p-stack-lg">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">Past analyses</h3>
          <div className="flex flex-col divide-y divide-border">
            {MOCK_ATS_SCORES.map((score) => {
              const job = getJobById(score.jobId);
              const resume = getResumeById(score.resumeId);
              return (
                <Link
                  key={score.id}
                  href={`/ats/${score.id}`}
                  className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-11 h-11 rounded-full bg-tertiary-container/10 text-tertiary flex items-center justify-center font-headline-md text-sm font-bold shrink-0">
                    {score.score}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-sm font-medium text-foreground truncate">
                      {job?.title} <span className="text-muted-foreground font-normal">vs</span>{" "}
                      {resume?.filename}
                    </p>
                    <p className="font-body-md text-xs text-muted-foreground mt-0.5">
                      {new Date(score.createdAt).toLocaleDateString()} &middot;{" "}
                      {score.missingKeywords.length} missing keyword
                      {score.missingKeywords.length === 1 ? "" : "s"}
                    </p>
                  </div>
                  <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                    chevron_right
                  </span>
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
