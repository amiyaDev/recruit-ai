import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { getJobById } from "@/constants/dashboard-mock-data";

export async function generateMetadata({
  params,
}: PageProps<"/jobs/[id]">): Promise<Metadata> {
  const { id } = await params;
  const job = getJobById(id);
  return { title: job ? `${job.title} - RecruitAI` : "Job - RecruitAI" };
}

export default async function JobDetailPage({ params }: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  const job = getJobById(id);
  if (!job) notFound();

  return (
    <div className="flex flex-col gap-stack-lg">
      <Link
        href="/jobs"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        Back to jobs
      </Link>

      <header className="flex flex-col md:flex-row md:items-start md:justify-between gap-stack-md">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center shrink-0">
            <span className="material-symbols-outlined text-[28px]">work</span>
          </div>
          <div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
              {job.title}
            </h2>
            <p className="font-body-md text-sm text-muted-foreground mt-1">
              {job.company ?? "No company specified"} &middot; Added{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <StatusBadge status={job.status} />
          <Link
            href={`/ats?jobId=${job.id}`}
            className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[18px]">troubleshoot</span>
            Run ATS analysis
          </Link>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <section className="lg:col-span-2 shadcn-card rounded-xl p-stack-lg">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
            Job description
          </h3>
          <p className="font-body-md text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
            {job.description}
          </p>
        </section>

        <section className="shadcn-card rounded-xl p-stack-lg h-fit">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md">
            Extracted keywords
          </h3>
          {job.extractedKeywords.length === 0 ? (
            <p className="font-body-md text-sm text-muted-foreground">
              Keyword extraction is still processing for this job.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {job.extractedKeywords.map((kw) => (
                <span
                  key={kw}
                  className="px-3 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-label-sm text-sm"
                >
                  {kw}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
