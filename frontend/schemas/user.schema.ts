import * as yup from "yup";

export const profileSchema = yup.object({
  name: yup.string().trim().required("Full name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().trim().required("Email is required").email("Enter a valid email address"),
});

export type ProfileFormValues = yup.InferType<typeof profileSchema>;
