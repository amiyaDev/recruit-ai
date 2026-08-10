import type { Metadata } from "next";

import { ResumeDetail } from "@/components/resumes/resume-detail";

export const metadata: Metadata = {
  title: "Resume - RecruitAI",
};

export default async function ResumeDetailPage({ params }: PageProps<"/resumes/[id]">) {
  const { id } = await params;
  return <ResumeDetail id={id} />;
}
