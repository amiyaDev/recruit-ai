import type { Step } from "@/types/landing.types"

export function StepCard({ number, title, description }: Step) {
  return (
    <div className="relative flex flex-col items-start gap-3">
      <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
        {number}
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
