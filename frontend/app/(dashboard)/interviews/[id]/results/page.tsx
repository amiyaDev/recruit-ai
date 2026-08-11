import type { Metadata } from "next";

import { InterviewResults } from "@/components/interviews/interview-results";

export const metadata: Metadata = {
  title: "Interview Results - RecruitAI",
};

export default async function InterviewResultsPage({ params }: PageProps<"/interviews/[id]/results">) {
  const { id } = await params;
  return <InterviewResults id={id} />;
}
