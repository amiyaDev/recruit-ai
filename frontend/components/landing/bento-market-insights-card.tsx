export function BentoMarketInsightsCard() {
  return (
    <div className="shadcn-card floating-card p-8 flex flex-col group">
      <div className="w-12 h-12 rounded-lg bg-secondary/10 dark:bg-secondary/20 flex items-center justify-center text-secondary dark:text-secondary-fixed mb-6 transition-colors border border-secondary/20 dark:border-secondary/30">
        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
          radar
        </span>
      </div>
      <h3 className="font-headline-md text-xl font-semibold text-foreground mb-3">
        Market Insights
      </h3>
      <p className="font-body-md text-muted-foreground mb-6">
        Real-time salary data and skill demand metrics.
      </p>
      <div className="w-full bg-surface-container-lowest dark:bg-black/30 rounded-lg p-4 border border-outline-variant/30 dark:border-white/10 shadow-sm dark:shadow-none mt-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-label-sm text-muted-foreground">React Developer</span>
          <span className="text-label-sm text-tertiary dark:text-tertiary-fixed">+14% Demand</span>
        </div>
        <div className="w-full h-1.5 bg-surface-container dark:bg-white/10 rounded-full">
          <div className="w-[85%] h-full bg-tertiary dark:bg-tertiary-fixed rounded-full" />
        </div>
      </div>
    </div>
  );
}
