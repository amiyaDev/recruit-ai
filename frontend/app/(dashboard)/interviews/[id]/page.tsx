import type { Metadata } from "next";

import { InterviewPractice } from "@/components/interviews/interview-practice";

export const metadata: Metadata = {
  title: "Interview Practice - RecruitAI",
};

export default async function InterviewPracticePage({ params }: PageProps<"/interviews/[id]">) {
  const { id } = await params;
  return <InterviewPractice id={id} />;
}
