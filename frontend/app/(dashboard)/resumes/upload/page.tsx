import type { Metadata } from "next";

import { ResumeUploader } from "@/components/resumes/resume-uploader";

export const metadata: Metadata = {
  title: "Upload Resume - RecruitAI",
};

export default function ResumeUploadPage() {
  return (
    <div className="flex flex-col gap-stack-lg">
      <header>
        <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
          Upload Resume
        </h2>
        <p className="font-body-md text-body-md text-muted-foreground mt-2">
          Drop a resume to let our AI engine parse skills, experience, and match potential.
        </p>
      </header>

      <ResumeUploader />
    </div>
  );
}
