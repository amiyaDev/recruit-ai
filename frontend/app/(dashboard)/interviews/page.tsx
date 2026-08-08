import Link from "next/link";
import type { Metadata } from "next";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { MOCK_INTERVIEWS, MOCK_JOBS, MOCK_RESUMES, getJobById, getResumeById } from "@/constants/dashboard-mock-data";

export const metadata: Metadata = {
  title: "Interviews - RecruitAI",
};

const DIFFICULTIES: { value: "easy" | "medium" | "hard"; label: string }[] = [
  { value: "easy", label: "Easy" },
  { value: "medium", label: "Medium" },
  { value: "hard", label: "Hard" },
];

export default function InterviewsPage() {
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <form className="lg:col-span-1 shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md h-fit">
          <h3 className="font-headline-md text-headline-md text-foreground">Start a session</h3>

          <div className="space-y-stack-sm">
            <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="interview-resume">
              Resume <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <select
              id="interview-resume"
              className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            >
              <option value="">None</option>
              {MOCK_RESUMES.map((resume) => (
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
            >
              <option value="">None</option>
              {MOCK_JOBS.map((job) => (
                <option key={job.id} value={job.id}>
                  {job.title}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-stack-sm">
            <span className="block font-label-sm text-label-sm text-muted-foreground">Difficulty</span>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTIES.map((d, i) => (
                <label
                  key={d.value}
                  className="flex items-center justify-center rounded-lg border border-border py-2 text-sm font-medium text-muted-foreground has-checked:border-primary has-checked:bg-primary/10 has-checked:text-primary cursor-pointer transition-colors"
                >
                  <input
                    type="radio"
                    name="difficulty"
                    value={d.value}
                    defaultChecked={i === 1}
                    className="sr-only"
                  />
                  {d.label}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 mt-stack-sm"
          >
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Generate 5 questions
          </button>
        </form>

        <section className="lg:col-span-2 shadcn-card rounded-xl p-stack-lg">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
            Past sessions
          </h3>
          <div className="flex flex-col divide-y divide-border">
            {MOCK_INTERVIEWS.map((session) => {
              const job = session.jobId ? getJobById(session.jobId) : undefined;
              const resume = session.resumeId ? getResumeById(session.resumeId) : undefined;
              const href =
                session.status === "completed"
                  ? `/interviews/${session.id}/results`
                  : `/interviews/${session.id}`;
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
                      {session.questions.length} questions
                    </p>
                  </div>
                  {session.status === "completed" && typeof session.overallScore === "number" && (
                    <span className="font-headline-md text-sm font-bold text-tertiary">
                      {session.overallScore}
                    </span>
                  )}
                  <StatusBadge status={session.status} />
                </Link>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
