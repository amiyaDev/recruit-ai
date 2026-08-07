import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Feature } from "@/types/landing.types"

export function FeatureCard({ icon: Icon, title, description }: Feature) {
  return (
    <Card className="h-full border-border/50 transition-colors hover:border-primary/40">
      <CardHeader>
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <CardTitle className="pt-2 text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}
