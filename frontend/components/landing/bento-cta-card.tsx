export function BentoCtaCard() {
  return (
    <div className="shadcn-card floating-card p-8 flex flex-col lg:col-span-2 group relative overflow-hidden justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent pointer-events-none" />
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 z-10 relative">
        <div className="flex-1">
          <h3 className="font-headline-md text-2xl font-semibold text-foreground mb-3">
            Ready to transform your search?
          </h3>
          <p className="font-body-md text-muted-foreground mb-6">
            Join thousands who have accelerated their careers.
          </p>
          <button type="button" className="shadcn-btn-primary font-body-md px-6 py-3">
            Start Your Journey
          </button>
        </div>
        <div className="flex-1 w-full flex justify-center">
          <div className="w-32 h-32 rounded-full border-4 border-primary/10 dark:border-primary/30 dark:bg-black/20 dark:backdrop-blur-sm flex items-center justify-center relative">
            <div className="absolute w-24 h-24 rounded-full border-4 border-tertiary dark:border-tertiary-fixed border-dashed animate-[spin_10s_linear_infinite] opacity-50" />
            <span className="material-symbols-outlined text-[40px] text-primary dark:text-primary-fixed">
              rocket_launch
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
