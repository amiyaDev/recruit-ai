import Link from "next/link";
import type { Metadata } from "next";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { MOCK_RESUMES } from "@/constants/dashboard-mock-data";

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

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-stack-md">
        {MOCK_RESUMES.map((resume) => (
          <Link
            key={resume.id}
            href={`/resumes/${resume.id}`}
            className="shadcn-card rounded-xl p-stack-md flex flex-col gap-stack-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="w-11 h-11 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-[22px]">
                  {resume.fileType === "pdf" ? "picture_as_pdf" : "description"}
                </span>
              </div>
              <StatusBadge status={resume.status} />
            </div>
            <div>
              <p className="font-body-md text-sm font-semibold text-foreground line-clamp-2">
                {resume.filename}
              </p>
              <p className="font-body-md text-xs text-muted-foreground mt-1">
                {resume.fileSizeLabel} &middot; {new Date(resume.createdAt).toLocaleDateString()}
              </p>
            </div>
            {resume.parsedData ? (
              <div className="flex flex-wrap gap-1.5 mt-1">
                {resume.parsedData.skills.slice(0, 4).map((skill) => (
                  <span
                    key={skill}
                    className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-label-sm text-[11px]"
                  >
                    {skill}
                  </span>
                ))}
                {resume.parsedData.skills.length > 4 && (
                  <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-label-sm text-[11px]">
                    +{resume.parsedData.skills.length - 4}
                  </span>
                )}
              </div>
            ) : (
              <p className="font-body-md text-xs text-destructive mt-1">
                Extraction failed — try re-uploading a text-based PDF.
              </p>
            )}
          </Link>
        ))}

        <Link
          href="/resumes/upload"
          className="rounded-xl border-2 border-dashed border-border hover:border-primary/50 flex flex-col items-center justify-center gap-2 p-stack-md min-h-[160px] text-muted-foreground hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined text-[28px]">add_circle</span>
          <span className="font-body-md text-sm font-medium">Upload another resume</span>
        </Link>
      </div>
    </div>
  );
}
