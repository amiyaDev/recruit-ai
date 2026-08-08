import Link from "next/link";
import type { Metadata } from "next";

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

      <form className="shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md">
          <div className="space-y-stack-sm">
            <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-title">
              Job title
            </label>
            <input
              id="job-title"
              type="text"
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
          <div className="space-y-stack-sm">
            <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-company">
              Company <span className="text-muted-foreground/60">(optional)</span>
            </label>
            <input
              id="job-company"
              type="text"
              placeholder="e.g. Northwind Labs"
              className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>
        </div>

        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="job-description">
            Job description
          </label>
          <textarea
            id="job-description"
            rows={10}
            placeholder="Paste the full job description here..."
            className="w-full bg-muted/50 border border-border rounded-lg py-3 px-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-stack-sm border-t border-border">
          <Link
            href="/jobs"
            className="font-label-sm text-sm text-muted-foreground hover:text-foreground px-4 py-2.5 transition-colors"
          >
            Cancel
          </Link>
          <button type="submit" className="shadcn-btn-primary font-label-sm text-sm px-6 py-2.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
            Extract keywords &amp; save
          </button>
        </div>
      </form>
    </div>
  );
}
