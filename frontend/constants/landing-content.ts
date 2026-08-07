import { FileText, Gauge, Mic, MessageCircle, Sparkles } from "lucide-react"

import type { Feature, NavLink, Stat, Step } from "@/types/landing.types"

export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
]

export const FEATURES: Feature[] = [
  {
    icon: FileText,
    title: "Smart Resume Parsing",
    description:
      "Upload your resume and let AI extract your skills, contact details, and experience in seconds — PDF or DOCX.",
  },
  {
    icon: Gauge,
    title: "ATS Score & Optimization",
    description:
      "Get an instant compatibility score against any job description, with keyword gaps and actionable suggestions.",
  },
  {
    icon: Sparkles,
    title: "Semantic Job Matching",
    description:
      "Powered by vector embeddings, see how well you truly match a role — beyond simple keyword matching.",
  },
  {
    icon: Mic,
    title: "AI Interview Practice",
    description:
      "Practice with tailored technical and behavioral questions, then get detailed, per-answer feedback.",
  },
  {
    icon: MessageCircle,
    title: "AI Career Assistant",
    description:
      "Chat with an AI coach that knows your resume and helps you navigate skills, gaps, and next moves.",
  },
]

export const STEPS: Step[] = [
  {
    number: 1,
    title: "Upload your resume",
    description: "Drop in a PDF or DOCX and we'll parse your skills and experience automatically.",
  },
  {
    number: 2,
    title: "Add a job description",
    description: "Paste in a role you're targeting so we know what to match you against.",
  },
  {
    number: 3,
    title: "Get your ATS score",
    description: "See exactly what's missing and how to improve your resume for that role.",
  },
  {
    number: 4,
    title: "Practice & get coached",
    description: "Run a mock interview and chat with your AI career assistant to close the gap.",
  },
]

export const STATS: Stat[] = [
  { label: "Resumes analyzed", value: "10K+" },
  { label: "Interview questions practiced", value: "50K+" },
  { label: "Avg. ATS score improvement", value: "+32%" },
  { label: "User satisfaction", value: "95%" },
]
