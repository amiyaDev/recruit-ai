import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function CtaSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6 lg:px-8">
      <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-primary-foreground/10 via-transparent to-transparent"
        />
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Ready to accelerate your job search?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-balance text-primary-foreground/80">
          Create a free account and get your first ATS score in minutes.
        </p>
        <div className="mt-8 flex justify-center">
          <Button size="lg" variant="secondary" className="gap-1.5">
            Get started free
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  )
}
