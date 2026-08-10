import Link from "next/link";
import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthBrand } from "@/components/auth/auth-brand";
import { LoginForm } from "@/components/auth/login-form";
import { SocialLoginButton } from "@/components/auth/social-login-button";

export const metadata: Metadata = {
  title: "Login - RecruitAI",
};

export default async function LoginPage({ searchParams }: PageProps<"/login">) {
  const { registered } = await searchParams;

  return (
    <AuthLayout>
      <AuthBrand />

      <div className="mb-stack-lg">
        <h1 className="font-headline-lg text-headline-lg mb-stack-sm text-surface">
          Welcome back
        </h1>
        <p className="font-body-lg text-body-lg text-surface-variant">
          Log in to your account to continue accelerating your career.
        </p>
      </div>

      {registered && (
        <div className="mb-stack-md flex items-start gap-2 rounded-lg border border-tertiary-fixed/30 bg-tertiary-fixed/10 px-4 py-3 text-tertiary-fixed fade-in-up">
          <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5">check_circle</span>
          <p className="font-body-md text-sm">Account created — log in to continue.</p>
        </div>
      )}

      <LoginForm />

      <div className="my-stack-md flex items-center justify-center gap-4 delay-200 fade-in-up">
        <div className="h-px bg-outline/20 flex-1" />
        <span className="font-label-sm text-label-sm text-outline-variant uppercase">
          Or continue with
        </span>
        <div className="h-px bg-outline/20 flex-1" />
      </div>

      <div className="delay-300 fade-in-up">
        <SocialLoginButton label="Sign in with Google" />
      </div>

      <div className="mt-stack-lg text-center delay-300 fade-in-up">
        <p className="font-body-md text-body-md text-surface-variant">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary-fixed hover:text-tertiary-fixed font-semibold transition-colors"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
}
