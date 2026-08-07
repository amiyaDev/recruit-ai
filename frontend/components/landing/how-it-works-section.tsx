import { STEPS } from "@/constants/landing-content"
import { StepCard } from "@/components/landing/step-card"

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="border-t border-border/50 bg-muted/30">
      <div className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">How it works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Four steps from resume upload to interview-ready.
          </p>
        </div>

        <div className="mt-16 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step) => (
            <StepCard key={step.number} {...step} />
          ))}
        </div>
      </div>
    </section>
  )
}
