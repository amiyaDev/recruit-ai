export function BentoResumeParsingCard() {
  return (
    <div className="shadcn-card floating-card p-8 flex flex-col md:flex-row gap-8 lg:col-span-2 group items-center">
      <div className="flex-1">
        <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary dark:text-primary-fixed mb-6 transition-colors border border-primary/20 dark:border-primary/30">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            document_scanner
          </span>
        </div>
        <h3 className="font-headline-md text-xl font-semibold text-foreground mb-3">
          Smart Resume Parsing
        </h3>
        <p className="font-body-md text-muted-foreground">
          Upload your existing resume and let our AI instantly map your skills, identify gaps,
          and suggest powerful action verbs tailored to your target industry.
        </p>
      </div>
      <div className="flex-1 w-full bg-surface-container-low dark:bg-black/40 rounded-xl h-48 border border-outline-variant/30 dark:border-white/10 relative overflow-hidden flex items-center justify-center">
        <span className="material-symbols-outlined text-[120px] text-foreground/5 dark:text-white/10 absolute">
          description
        </span>
        <div className="w-3/4 h-2 bg-primary/20 rounded-full overflow-hidden">
          <div className="w-2/3 h-full bg-primary dark:bg-primary-fixed rounded-full animate-pulse" />
        </div>
      </div>
    </div>
  );
}
