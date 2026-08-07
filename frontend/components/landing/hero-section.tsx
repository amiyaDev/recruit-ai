import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function HeroSection() {
  return (
    <ScrollReveal className="visible">
      <section className="relative grid lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
        <div className="space-y-8 z-10 text-center lg:text-left">
          <div className="inline-block px-4 py-2 rounded-full border border-primary/20 dark:border-primary/30 bg-primary/5 dark:bg-primary/10 text-primary dark:text-primary-fixed text-label-sm w-fit uppercase tracking-wider backdrop-blur-md mx-auto lg:mx-0">
            AI-Powered Career Accelerator
          </div>
          <h1 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-foreground">
            Land Your <br className="hidden lg:block" />
            <span className="text-gradient">Dream Job</span> <br className="hidden lg:block" />
            Faster with AI
          </h1>
          <p className="font-body-lg text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0">
            The smart career coach that optimizes your resume, matches you with roles, and
            prepares you for success.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            <button
              type="button"
              className="shadcn-btn-primary font-body-md px-8 py-4 flex items-center justify-center gap-2"
            >
              Get Started Free
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </button>
            <button
              type="button"
              className="shadcn-btn-outline font-body-md px-8 py-4 flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined text-[20px]">play_circle</span>
              See How It Works
            </button>
          </div>
          <div className="pt-4 flex items-center justify-center lg:justify-start gap-4 text-sm font-label-sm text-muted-foreground">
            <div className="flex -space-x-3">
              <div className="w-8 h-8 rounded-full bg-surface-container border border-surface-dim" />
              <div className="w-8 h-8 rounded-full bg-primary-container border border-surface-dim" />
              <div className="w-8 h-8 rounded-full bg-tertiary-container border border-surface-dim" />
            </div>
            <span>Trusted by 50,000+ professionals</span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full h-[500px] flex justify-center items-center z-10">
          <div className="absolute inset-0 bg-primary-container/10 dark:bg-primary-container/20 rounded-full blur-[80px] w-[80%] h-[80%] m-auto z-0" />
          <img
            alt="AI-powered career accelerator dashboard with a professional woman"
            className="w-full h-full rounded-2xl object-cover shadow-2xl border border-outline-variant/30 dark:border-white/10 shadcn-card p-0 relative z-10"
            src="/images/hero_image.png"
          />
          {/* Floating Glass Card */}
          <ScrollReveal className="visible absolute -bottom-8 -left-8 z-20 shadcn-card rounded-xl p-6 flex items-center gap-6 overflow-hidden shadow-xl border-white/50 dark:border-white/10 bg-white/90 dark:bg-transparent backdrop-blur-md">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <div className="absolute inset-0 ats-conic-ring" />
              <div className="absolute inset-0 flex items-center justify-center font-headline-md text-headline-md text-foreground z-10 dark:drop-shadow-md">
                92
              </div>
            </div>
            <div className="relative z-10">
              <div className="font-headline-md text-body-lg text-foreground mb-1 dark:drop-shadow-md">
                ATS Score
              </div>
              <div className="font-body-md text-label-sm text-tertiary dark:text-tertiary-fixed flex items-center gap-1 dark:drop-shadow-md">
                <span className="material-symbols-outlined text-[14px]">trending_up</span> Top 5%
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </ScrollReveal>
  );
}
