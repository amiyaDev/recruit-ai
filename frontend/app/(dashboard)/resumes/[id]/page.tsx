import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { DeleteResumeButton } from "@/components/dashboard/delete-resume-button";
import { MOCK_ATS_SCORES, getJobById, getResumeById } from "@/constants/dashboard-mock-data";

export async function generateMetadata({
  params,
}: PageProps<"/resumes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const resume = getResumeById(id);
  return { title: resume ? `${resume.filename} - RecruitAI` : "Resume - RecruitAI" };
}

export default async function ResumeDetailPage({ params }: PageProps<"/resumes/[id]">) {
  const { id } = await params;
  const resume = getResumeById(id);
  if (!resume) notFound();

  const relatedScores = MOCK_ATS_SCORES.filter((s) => s.resumeId === resume.id);

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        href="/resumes"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to resumes
      </Link>

      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">
              {resume.fileType === "pdf" ? "picture_as_pdf" : "description"}
            </span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground break-all">
              {resume.filename}
            </h2>
            <p className="font-body-md text-sm text-muted-foreground mt-1">
              {resume.fileSizeLabel} &middot; Uploaded {new Date(resume.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={resume.status} />
          <button
            type="button"
            className="shadcn-btn-outline font-label-sm text-sm px-4 py-2 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Re-parse
          </button>
          <DeleteResumeButton filename={resume.filename} />
        </div>
      </header>

      {resume.status === "failed" ? (
        <div className="shadcn-card rounded-xl p-stack-lg flex items-start gap-4 border-l-4 border-destructive">
          <span className="material-symbols-outlined text-destructive text-[24px]">error</span>
          <div>
            <p className="font-body-md text-sm font-semibold text-foreground">
              We couldn&apos;t extract any text from this file
            </p>
            <p className="font-body-md text-sm text-muted-foreground mt-1">
              This usually happens with scanned image-only PDFs. Try re-exporting the resume as a
              text-based PDF or DOCX, then re-upload.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
          <div className="lg:col-span-2 flex flex-col gap-stack-lg">
            <section className="shadcn-card rounded-xl p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
                Extracted contact info
              </h3>
              <div className="flex flex-col gap-stack-sm">
                <div className="flex items-center gap-stack-sm bg-muted/50 p-stack-sm rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <span className="font-body-md text-sm text-foreground">
                    {resume.parsedData?.email ?? "Not detected"}
                  </span>
                </div>
                <div className="flex items-center gap-stack-sm bg-muted/50 p-stack-sm rounded-lg">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <span className="font-body-md text-sm text-foreground">
                    {resume.parsedData?.phone ?? "Not detected"}
                  </span>
                </div>
              </div>
            </section>

            <section className="shadcn-card rounded-xl p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
                Detected skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {resume.parsedData?.skills.map((skill) => (
                  <span
                    key={skill}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </section>

            <section className="shadcn-card rounded-xl p-stack-lg">
              <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
                Raw text preview
              </h3>
              <p className="font-body-md text-sm text-muted-foreground leading-relaxed">
                {resume.rawTextExcerpt}
              </p>
            </section>
          </div>

          <div className="flex flex-col gap-stack-lg">
            <section className="shadcn-card rounded-xl p-stack-lg">
              <div className="flex items-center justify-between mb-stack-md">
                <h3 className="font-headline-md text-headline-md text-foreground">ATS history</h3>
                <Link
                  href="/ats"
                  className="font-label-sm text-xs text-primary hover:underline"
                >
                  New analysis
                </Link>
              </div>
              {relatedScores.length === 0 ? (
                <p className="font-body-md text-sm text-muted-foreground">
                  No ATS analysis run against this resume yet.
                </p>
              ) : (
                <div className="flex flex-col divide-y divide-border">
                  {relatedScores.map((score) => {
                    const job = getJobById(score.jobId);
                    return (
                      <Link
                        key={score.id}
                        href={`/ats/${score.id}`}
                        className="flex items-center gap-3 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                      >
                        <div className="w-9 h-9 rounded-full bg-tertiary-container/10 text-tertiary flex items-center justify-center font-headline-md text-xs font-bold shrink-0">
                          {score.score}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-body-md text-sm font-medium text-foreground truncate">
                            {job?.title}
                          </p>
                          <p className="font-body-md text-xs text-muted-foreground">{job?.company}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>

            <Link
              href={`/interviews?resumeId=${resume.id}`}
              className="shadcn-card rounded-xl p-stack-lg flex items-center gap-4 group"
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-white text-[20px]">psychology</span>
              </div>
              <div className="flex-1">
                <p className="font-body-md text-sm font-semibold text-foreground">Practice an interview</p>
                <p className="font-body-md text-xs text-muted-foreground mt-1">
                  Generate questions based on this resume
                </p>
              </div>
              <span className="material-symbols-outlined text-muted-foreground group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
