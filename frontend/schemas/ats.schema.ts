import * as yup from "yup";

export const atsAnalyzeSchema = yup.object({
  resumeId: yup.string().required("Select a resume"),
  jobId: yup.string().required("Select a job description"),
});

export type AtsAnalyzeFormValues = yup.InferType<typeof atsAnalyzeSchema>;
