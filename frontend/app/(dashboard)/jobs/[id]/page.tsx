import type { Metadata } from "next";

import { JobDetail } from "@/components/jobs/job-detail";

export const metadata: Metadata = {
  title: "Job - RecruitAI",
};

export default async function JobDetailPage({ params }: PageProps<"/jobs/[id]">) {
  const { id } = await params;
  return <JobDetail id={id} />;
}
