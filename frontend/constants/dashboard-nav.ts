export interface DashboardNavItem {
  label: string;
  href: string;
  icon: string;
}

export const DASHBOARD_NAV_ITEMS: DashboardNavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: "space_dashboard" },
  { label: "Resumes", href: "/resumes", icon: "description" },
  { label: "Jobs", href: "/jobs", icon: "work" },
  { label: "ATS Analysis", href: "/ats", icon: "troubleshoot" },
  { label: "Interviews", href: "/interviews", icon: "psychology" },
  { label: "AI Chat", href: "/chat", icon: "forum" },
];
