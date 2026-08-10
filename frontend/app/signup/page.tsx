import Link from "next/link";
import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthBrand } from "@/components/auth/auth-brand";
import { SignUpForm } from "@/components/auth/signup-form";
import { SocialLoginButton } from "@/components/auth/social-login-button";

export const metadata: Metadata = {
  title: "RecruitAI - Sign Up",
};

export default function SignUpPage() {
  return (
    <AuthLayout>
      <AuthBrand />

      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg mb-stack-sm text-surface">
          Join the future
        </h1>
        <p className="font-body-lg text-body-lg text-surface-variant">
          Create an account to unlock AI-powered career coaching.
        </p>
      </div>

      <SignUpForm />

      <div className="my-stack-md flex items-center justify-center gap-4 delay-200 fade-in-up">
        <div className="h-px bg-outline/20 flex-1" />
        <span className="font-label-sm text-label-sm text-outline-variant uppercase">
          Or continue with
        </span>
        <div className="h-px bg-outline/20 flex-1" />
      </div>

      <div className="delay-300 fade-in-up">
        <SocialLoginButton label="Sign up with Google" />
      </div>

      <div className="mt-stack-lg text-center delay-300 fade-in-up">
        <p className="font-body-md text-body-md text-surface-variant">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-primary-fixed hover:text-tertiary-fixed font-semibold transition-colors"
          >
            Login
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
