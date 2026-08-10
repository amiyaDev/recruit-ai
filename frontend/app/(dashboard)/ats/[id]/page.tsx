import type { Metadata } from "next";

import { AtsResult } from "@/components/ats/ats-result";

export const metadata: Metadata = {
  title: "ATS Result - RecruitAI",
};

export default async function AtsResultPage({ params }: PageProps<"/ats/[id]">) {
  const { id } = await params;
  return <AtsResult id={id} />;
}
