import * as yup from "yup";

export const interviewGenerateSchema = yup.object({
  resumeId: yup.string().optional(),
  jobId: yup.string().optional(),
  difficulty: yup.mixed<"easy" | "medium" | "hard">().oneOf(["easy", "medium", "hard"]).required(),
});

export type InterviewGenerateFormValues = yup.InferType<typeof interviewGenerateSchema>;
