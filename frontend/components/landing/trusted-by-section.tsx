import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { TRUSTED_BY } from "@/constants/landing-content";

export function TrustedBySection() {
  return (
    <ScrollReveal className="py-12 border-y border-outline-variant/30 dark:border-white/10">
      <p className="text-center font-label-sm text-muted-foreground uppercase tracking-wider mb-8">
        Trusted by top companies
      </p>
      <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
        {TRUSTED_BY.map((company) => (
          <div key={company.name} className="flex items-center gap-2">
            <span className="material-symbols-outlined text-4xl">{company.icon}</span>
            <span className="font-headline-md font-bold text-xl">{company.name}</span>
          </div>
        ))}
      </div>
    </ScrollReveal>
  );
}
