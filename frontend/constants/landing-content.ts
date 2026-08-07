import type { NavLink, Stat, Testimonial, TrustedCompany } from "@/types/landing.types";

export const NAV_LINKS: NavLink[] = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
];

export const TRUSTED_BY: TrustedCompany[] = [
  { name: "CloudSys", icon: "cloud" },
  { name: "DataTech", icon: "data_exploration" },
  { name: "NexusAPI", icon: "api" },
  { name: "ShieldNet", icon: "security" },
  { name: "OmniHub", icon: "hub" },
];

export const STATS: Stat[] = [
  { label: "Avg ATS Improvement", value: "45%", emphasis: true },
  { label: "User Satisfaction", value: "98%" },
];

export const TESTIMONIALS: Testimonial[] = [
  {
    initials: "SJ",
    name: "Sarah J.",
    role: "Product Manager",
    quote:
      "RecruitAI completely revamped my resume. The ATS optimizer helped me land interviews at top tech companies within weeks.",
    avatarClassName: "bg-primary-container/20 text-primary dark:text-primary-fixed",
  },
  {
    initials: "MR",
    name: "Michael R.",
    role: "Senior Developer",
    quote:
      "The mock interview feature is a game-changer. It gave me the confidence to nail my final rounds. Highly recommended!",
    avatarClassName: "bg-secondary-container/20 text-secondary dark:text-secondary-fixed-dim",
  },
  {
    initials: "AL",
    name: "Amanda L.",
    role: "UX Designer",
    quote:
      "I transitioned to a new industry and the semantic match feature found roles I wouldn't have even considered applying for.",
    avatarClassName: "bg-tertiary-container/20 text-tertiary dark:text-tertiary-fixed",
  },
];

export const FOOTER_LINKS: Record<string, string[]> = {
  Product: ["Features", "Pricing"],
  Company: ["About", "Careers"],
  Legal: ["Privacy", "Terms"],
};
