import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Upload Resume - RecruitAI",
};

export default function ResumeUploadPage() {
  return (
    <div className="flex flex-col gap-stack-lg">
      <header>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
          Upload Resume
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground mt-2">
          Drop a resume to let our AI engine parse skills, experience, and match potential.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
        {/* Left: Dropzone + pipeline */}
        <div className="lg:col-span-7 flex flex-col gap-stack-lg">
          <div className="relative group cursor-pointer h-72 md:h-80 rounded-xl">
            <div className="absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-primary via-tertiary-fixed-dim to-secondary-container opacity-70 group-hover:opacity-100 transition-opacity">
              <div className="absolute inset-0 bg-card rounded-xl h-full w-full" />
            </div>
            <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-stack-md px-stack-lg">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ease-out">
                <span className="material-symbols-outlined text-[40px] md:text-[48px] text-primary">
                  cloud_upload
                </span>
              </div>
              <div>
                <p className="font-headline-md text-headline-md text-foreground">Drag &amp; drop resume</p>
                <p className="font-body-md text-body-md text-muted-foreground mt-2">
                  or <span className="text-primary underline underline-offset-4">browse files</span> (PDF,
                  DOCX — max 5MB)
                </p>
              </div>
            </div>
          </div>

          <div className="shadcn-card rounded-xl p-stack-md flex flex-col gap-stack-md">
            <div className="flex justify-between items-center px-stack-sm">
              <span className="font-label-sm text-label-sm text-muted-foreground">Upload status</span>
              <span className="font-label-sm text-label-sm text-primary bg-primary/10 px-3 py-1 rounded-full">
                Waiting for a file
              </span>
            </div>
            <div className="relative flex justify-between items-center pt-stack-sm pb-1">
              <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2 z-0" />
              {[
                { label: "Uploaded", icon: "check", active: false },
                { label: "Parsing", icon: "document_scanner", active: false },
                { label: "Ready", icon: "task_alt", active: false },
              ].map((step) => (
                <div key={step.label} className="relative z-10 flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted border-2 border-border text-muted-foreground flex items-center justify-center">
                    <span className="material-symbols-outlined text-[16px]">{step.icon}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-muted-foreground">{step.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: live analysis preview */}
        <div className="lg:col-span-5">
          <div className="shadcn-card rounded-xl p-stack-lg h-full flex flex-col">
            <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">troubleshoot</span>
              Live analysis
            </h3>

            <div className="flex-1 flex flex-col gap-stack-md">
              <div className="space-y-stack-sm">
                <div className="font-label-sm text-label-sm text-muted-foreground mb-2">
                  IDENTIFIED CANDIDATE
                </div>
                <div className="bg-muted/50 p-stack-sm rounded-lg flex items-center gap-stack-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="bg-muted/50 p-stack-sm rounded-lg flex items-center gap-stack-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </div>
              </div>

              <div className="mt-stack-md">
                <div className="font-label-sm text-label-sm text-muted-foreground mb-stack-sm">
                  DETECTED SKILLS
                </div>
                <div className="flex flex-wrap gap-2">
                  {[20, 24, 16, 28, 20].map((w, i) => (
                    <div key={i} className="h-8 rounded-full bg-muted animate-pulse" style={{ width: w * 4 }} />
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-stack-lg flex flex-col items-center gap-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 absolute inset-0 text-border" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
                  </svg>
                  <div className="text-center">
                    <span className="font-headline-md text-headline-md text-muted-foreground block">---</span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-muted-foreground">
                  Score appears once a resume finishes parsing
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
