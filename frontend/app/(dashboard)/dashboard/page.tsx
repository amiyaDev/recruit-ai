import Link from "next/link";
import type { Metadata } from "next";

import { StatusBadge } from "@/components/dashboard/status-badge";
import {
  MOCK_ATS_SCORES,
  MOCK_CHATS,
  MOCK_INTERVIEWS,
  MOCK_JOBS,
  MOCK_RESUMES,
  MOCK_USER,
  getJobById,
} from "@/constants/dashboard-mock-data";

export const metadata: Metadata = {
  title: "Dashboard - RecruitAI",
};

const STAT_CARDS = [
  {
    label: "Resumes uploaded",
    value: MOCK_RESUMES.length,
    icon: "description",
    href: "/resumes",
    accent: "text-primary bg-primary/10",
  },
  {
    label: "Avg. ATS score",
    value: `${Math.round(
      MOCK_ATS_SCORES.reduce((sum, s) => sum + s.score, 0) / MOCK_ATS_SCORES.length
    )}`,
    icon: "troubleshoot",
    href: "/ats",
    accent: "text-secondary bg-secondary/10",
  },
  {
    label: "Interview sessions",
    value: MOCK_INTERVIEWS.length,
    icon: "psychology",
    href: "/interviews",
    accent: "text-tertiary bg-tertiary-container/10",
  },
  {
    label: "Chat conversations",
    value: MOCK_CHATS.length,
    icon: "forum",
    href: "/chat",
    accent: "text-warning bg-warning/10",
  },
];

const QUICK_ACTIONS = [
  {
    title: "Upload a resume",
    description: "Parse skills, contact info, and experience with AI.",
    icon: "cloud_upload",
    href: "/resumes/upload",
  },
  {
    title: "Run ATS analysis",
    description: "Score a resume against a job description in seconds.",
    icon: "troubleshoot",
    href: "/ats",
  },
  {
    title: "Practice an interview",
    description: "Generate technical + behavioral questions and get feedback.",
    icon: "psychology",
    href: "/interviews",
  },
  {
    title: "Ask the AI career coach",
    description: "Get personalized guidance grounded in your resume.",
    icon: "forum",
    href: "/chat",
  },
];

export default function DashboardOverviewPage() {
  const firstName = MOCK_USER.name.split(" ")[0];

  return (
    <div className="flex flex-col gap-stack-lg">
      <header>
        <p className="font-label-sm text-label-sm text-primary uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="material-symbols-outlined text-sm">waving_hand</span>
          Welcome back
        </p>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
          Hey {firstName}, here&apos;s your career snapshot
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground mt-2">
          Pick up where you left off, or start something new below.
        </p>
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-stack-md">
        {STAT_CARDS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="shadcn-card rounded-xl p-stack-md flex flex-col gap-3"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${stat.accent}`}>
              <span className="material-symbols-outlined text-[20px]">{stat.icon}</span>
            </div>
            <div>
              <p className="font-headline-md text-2xl font-bold text-foreground leading-none">{stat.value}</p>
              <p className="font-body-md text-sm text-muted-foreground mt-1">{stat.label}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-stack-lg">
        <div className="lg:col-span-2 flex flex-col gap-stack-lg">
          <section className="shadcn-card rounded-xl p-stack-lg">
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-headline-md text-headline-md text-foreground">Recent resumes</h3>
              <Link href="/resumes" className="font-label-sm text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {MOCK_RESUMES.map((resume) => (
                <Link
                  key={resume.id}
                  href={`/resumes/${resume.id}`}
                  className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-[20px]">description</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-body-md text-sm font-medium text-foreground truncate">{resume.filename}</p>
                    <p className="font-body-md text-xs text-muted-foreground">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <StatusBadge status={resume.status} />
                </Link>
              ))}
            </div>
          </section>

          <section className="shadcn-card rounded-xl p-stack-lg">
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-headline-md text-headline-md text-foreground">Recent ATS scores</h3>
              <Link href="/ats" className="font-label-sm text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            <div className="flex flex-col divide-y divide-border">
              {MOCK_ATS_SCORES.map((score) => {
                const job = getJobById(score.jobId);
                return (
                  <Link
                    key={score.id}
                    href={`/ats/${score.id}`}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-tertiary-container/10 text-tertiary flex items-center justify-center shrink-0 font-headline-md text-sm font-bold">
                      {score.score}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-md text-sm font-medium text-foreground truncate">
                        {job?.title ?? "Job description"}
                      </p>
                      <p className="font-body-md text-xs text-muted-foreground">{job?.company}</p>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                      chevron_right
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-stack-md">
          {QUICK_ACTIONS.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="shadcn-card rounded-xl p-stack-md flex items-start gap-4 group"
            >
              <div className="w-11 h-11 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 shadow-[0_4px_12px_rgba(79,70,229,0.25)]">
                <span className="material-symbols-outlined text-white text-[20px]">{action.icon}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-body-md text-sm font-semibold text-foreground">{action.title}</p>
                <p className="font-body-md text-xs text-muted-foreground mt-1">{action.description}</p>
              </div>
              <span className="material-symbols-outlined text-muted-foreground text-[18px] group-hover:translate-x-1 transition-transform">
                arrow_forward
              </span>
            </Link>
          ))}
          <section className="shadcn-card rounded-xl p-stack-lg bg-muted/30">
            <div className="flex justify-between items-center px-1">
              <span className="font-label-sm text-label-sm text-muted-foreground">Demo budget</span>
              <span className="font-label-sm text-label-sm text-warning bg-warning/10 px-2.5 py-1 rounded-full">
                $4.31 / $5.00
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted mt-3 overflow-hidden">
              <div className="h-full w-[86%] rounded-full bg-gradient-to-r from-warning to-tertiary-fixed-dim" />
            </div>
            <p className="font-body-md text-xs text-muted-foreground mt-3">
              Estimated OpenAI spend this month, tracked via <code>usage_tracker</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
