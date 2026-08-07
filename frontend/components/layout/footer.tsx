import Link from "next/link"
import { Sparkles } from "lucide-react"

import { Separator } from "@/components/ui/separator"

const FOOTER_LINKS: Record<string, string[]> = {
  Product: ["Features", "How it works"],
  Company: ["About", "Contact"],
  Legal: ["Privacy", "Terms"],
}

export function Footer() {
  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Sparkles className="size-4" />
              </span>
              <span className="text-lg">RecruitAI</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted-foreground">
              AI-powered resume analysis, ATS optimization, interview practice, and career
              coaching.
            </p>
          </div>

          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="text-sm font-semibold">{heading}</h3>
              <ul className="mt-3 space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} RecruitAI. All rights reserved.
        </p>
      </div>
    </footer>
  )
}
