import type { Metadata } from "next";

import { DashboardOverview } from "@/components/dashboard/dashboard-overview";

export const metadata: Metadata = {
  title: "Dashboard - RecruitAI",
};

export default function DashboardOverviewPage() {
  return <DashboardOverview />;
}
