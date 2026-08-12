"use client";

import Link from "next/link";

import { StatusBadge } from "@/components/dashboard/status-badge";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useDashboardSummary } from "@/hooks/dashboard/use-dashboard-summary";
import { useUser } from "@/context/user-context";

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

function StatCardSkeleton() {
  return (
    <div className="shadcn-card rounded-xl p-stack-md flex flex-col gap-3 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-muted" />
      <div className="h-6 w-10 rounded bg-muted" />
      <div className="h-3 w-24 rounded bg-muted" />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="flex flex-col gap-3 animate-pulse">
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-14 rounded-lg bg-muted" />
      ))}
    </div>
  );
}

export function DashboardOverview() {
  const { user } = useUser();
  const { data: summary, isLoading, isError, error } = useDashboardSummary();

  const firstName = user?.name?.split(" ")[0] ?? "there";

  const statCards = summary
    ? [
        {
          label: "Resumes uploaded",
          value: summary.resume_count,
          icon: "description",
          href: "/resumes",
          accent: "text-primary bg-primary/10",
        },
        {
          label: "Avg. ATS score",
          value: summary.avg_ats_score !== null ? Math.round(summary.avg_ats_score) : "—",
          icon: "troubleshoot",
          href: "/ats",
          accent: "text-secondary bg-secondary/10",
        },
        {
          label: "Interview sessions",
          value: summary.interview_count,
          icon: "psychology",
          href: "/interviews",
          accent: "text-tertiary bg-tertiary-container/10",
        },
        {
          label: "Chat conversations",
          value: summary.chat_count,
          icon: "forum",
          href: "/chat",
          accent: "text-warning bg-warning/10",
        },
      ]
    : [];

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

      {isError && <FormError message={getApiErrorMessage(error, "Couldn't load your dashboard.")} />}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-stack-md">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => <StatCardSkeleton key={i} />)
          : statCards.map((stat) => (
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
            {isLoading ? (
              <ListSkeleton />
            ) : summary && summary.recent_resumes.length > 0 ? (
              <div className="flex flex-col divide-y divide-border">
                {summary.recent_resumes.map((resume) => (
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
                        {new Date(resume.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <StatusBadge status={resume.status} />
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-body-md text-sm text-muted-foreground py-4">
                No resumes yet —{" "}
                <Link href="/resumes/upload" className="text-primary hover:underline">
                  upload one
                </Link>{" "}
                to get started.
              </p>
            )}
          </section>

          <section className="shadcn-card rounded-xl p-stack-lg">
            <div className="flex items-center justify-between mb-stack-md">
              <h3 className="font-headline-md text-headline-md text-foreground">Recent ATS scores</h3>
              <Link href="/ats" className="font-label-sm text-xs text-primary hover:underline">
                View all
              </Link>
            </div>
            {isLoading ? (
              <ListSkeleton />
            ) : summary && summary.recent_ats_scores.length > 0 ? (
              <div className="flex flex-col divide-y divide-border">
                {summary.recent_ats_scores.map((score) => (
                  <Link
                    key={score.id}
                    href={`/ats/${score.id}`}
                    className="flex items-center gap-4 py-3 first:pt-0 last:pb-0 hover:bg-muted/40 -mx-2 px-2 rounded-lg transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-tertiary-container/10 text-tertiary flex items-center justify-center shrink-0 font-headline-md text-sm font-bold">
                      {Math.round(score.score)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-body-md text-sm font-medium text-foreground truncate">{score.job_title}</p>
                      <p className="font-body-md text-xs text-muted-foreground">{score.job_company}</p>
                    </div>
                    <span className="material-symbols-outlined text-muted-foreground text-[18px]">
                      chevron_right
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="font-body-md text-sm text-muted-foreground py-4">
                No ATS analyses yet —{" "}
                <Link href="/ats" className="text-primary hover:underline">
                  run one
                </Link>{" "}
                against a resume and job.
              </p>
            )}
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
                {summary
                  ? `$${summary.usage.spent_usd.toFixed(2)} / $${summary.usage.budget_usd.toFixed(2)}`
                  : "…"}
              </span>
            </div>
            <div className="h-2 rounded-full bg-muted mt-3 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-warning to-tertiary-fixed-dim transition-all"
                style={{ width: `${summary?.usage.percent ?? 0}%` }}
              />
            </div>
            <p className="font-body-md text-xs text-muted-foreground mt-3">
              Estimated OpenAI spend across the demo, tracked via <code>usage_tracker</code>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
