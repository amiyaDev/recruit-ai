import { FEATURES } from "@/constants/landing-content"
import { FeatureCard } from "@/components/landing/feature-card"

export function FeaturesSection() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Everything you need to get hired
        </h2>
        <p className="mt-4 text-lg text-muted-foreground">
          One toolkit, from your first upload to your final interview.
        </p>
      </div>

      <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {FEATURES.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
}
