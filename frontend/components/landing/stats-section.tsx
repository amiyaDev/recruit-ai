import { cn } from "@/lib/utils";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { STATS } from "@/constants/landing-content";

export function StatsSection() {
  return (
    <ScrollReveal className="grid grid-cols-1 sm:grid-cols-2 gap-6 py-8 max-w-3xl mx-auto">
      {STATS.map((stat) => (
        <div key={stat.label} className="text-center space-y-1">
          <p
            className={cn(
              "font-headline-lg text-4xl font-bold",
              stat.emphasis ? "text-tertiary" : "text-foreground",
            )}
          >
            {stat.value}
          </p>
          <p className="font-body-md text-muted-foreground font-medium">{stat.label}</p>
        </div>
      ))}
    </ScrollReveal>
  );
}
