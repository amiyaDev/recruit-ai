import * as yup from "yup";

// Password bounds mirror the backend exactly:
// backend/schemas/auth.py -> Field(min_length=8, max_length=72)
export const loginSchema = yup.object({
  email: yup.string().trim().required("Email is required").email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
});

export type LoginFormValues = yup.InferType<typeof loginSchema>;

export const registerSchema = yup.object({
  name: yup.string().trim().required("Full name is required").min(2, "Name must be at least 2 characters"),
  email: yup.string().trim().required("Email is required").email("Enter a valid email address"),
  password: yup
    .string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be at most 72 characters"),
  confirmPassword: yup
    .string()
    .required("Please confirm your password")
    .oneOf([yup.ref("password")], "Passwords must match"),
});

export type RegisterFormValues = yup.InferType<typeof registerSchema>;
