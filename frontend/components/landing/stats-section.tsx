import { STATS } from "@/constants/landing-content"

export function StatsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="grid grid-cols-2 gap-8 rounded-2xl border border-border/50 bg-card p-8 sm:grid-cols-4 sm:p-10">
        {STATS.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="text-3xl font-bold tracking-tight text-primary sm:text-4xl">
              {stat.value}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
