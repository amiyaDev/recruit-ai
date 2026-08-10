import * as yup from "yup";

export const jobSchema = yup.object({
  title: yup.string().trim().required("Job title is required").min(2, "Title must be at least 2 characters"),
  company: yup.string().trim().optional(),
  description: yup
    .string()
    .trim()
    .required("Job description is required")
    .min(50, "Paste the full job description (at least 50 characters) for accurate keyword extraction"),
});

export type JobFormValues = yup.InferType<typeof jobSchema>;
