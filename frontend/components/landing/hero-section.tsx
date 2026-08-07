import Link from "next/link"
import { ArrowRight, Sparkles } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center blur-3xl"
      >
        <div className="aspect-[1155/678] w-[72rem] bg-gradient-to-tr from-primary/30 via-primary/10 to-transparent opacity-40 dark:opacity-20" />
      </div>

      <div className="mx-auto max-w-6xl px-4 py-24 text-center sm:px-6 sm:py-32 lg:px-8">
        <Badge variant="secondary" className="gap-1.5">
          <Sparkles className="size-3.5" />
          AI-powered career toolkit
        </Badge>

        <h1 className="mx-auto mt-6 max-w-3xl text-balance text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
          Land your dream job, <span className="text-primary">faster</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg text-muted-foreground">
          RecruitAI analyzes your resume, scores it against real job descriptions, and coaches
          you through interviews — so you always know exactly what to fix next.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" className="gap-1.5">
            Get started free
            <ArrowRight className="size-4" />
          </Button>
          <Link
            href="#how-it-works"
            className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
          >
            See how it works
          </Link>
        </div>
      </div>
    </section>
  )
}
