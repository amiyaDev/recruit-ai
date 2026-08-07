export function BentoInterviewPrepCard() {
  return (
    <div className="shadcn-card floating-card p-8 flex flex-col justify-between group">
      <div>
        <div className="w-12 h-12 rounded-lg bg-tertiary/10 dark:bg-tertiary/20 flex items-center justify-center text-tertiary dark:text-tertiary-fixed mb-6 transition-colors border border-tertiary/20 dark:border-tertiary/30">
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
            psychology
          </span>
        </div>
        <h3 className="font-headline-md text-xl font-semibold text-foreground mb-3">
          Interview Prep
        </h3>
        <p className="font-body-md text-muted-foreground">
          Practice with our conversational AI that tailors questions based on the exact job
          description you are applying for.
        </p>
      </div>
      <div className="mt-6 flex justify-end">
        <span className="material-symbols-outlined text-outline/30 dark:text-white/20 text-[40px]">
          mic
        </span>
      </div>
    </div>
  );
}
