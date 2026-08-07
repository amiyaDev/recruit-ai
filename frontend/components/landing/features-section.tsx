import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { BentoResumeParsingCard } from "@/components/landing/bento-resume-parsing-card";
import { BentoInterviewPrepCard } from "@/components/landing/bento-interview-prep-card";
import { BentoMarketInsightsCard } from "@/components/landing/bento-market-insights-card";
import { BentoCtaCard } from "@/components/landing/bento-cta-card";

export function FeaturesSection() {
  return (
    <ScrollReveal className="space-y-12" id="features">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h2 className="font-headline-lg text-3xl md:text-4xl font-bold tracking-tight text-foreground">
          Powerful tools for your job search
        </h2>
        <p className="font-body-md text-muted-foreground text-lg">
          Everything you need to stand out in today&apos;s competitive market, powered by
          advanced artificial intelligence.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <BentoResumeParsingCard />
        <BentoInterviewPrepCard />
        <BentoMarketInsightsCard />
        <BentoCtaCard />
      </div>
    </ScrollReveal>
  );
}
