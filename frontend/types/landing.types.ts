import type { LucideIcon } from "lucide-react"

export interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

export interface Step {
  number: number
  title: string
  description: string
}

export interface Stat {
  label: string
  value: string
}

export interface NavLink {
  label: string
  href: string
}
