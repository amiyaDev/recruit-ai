import Link from "next/link";
import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthBrand } from "@/components/auth/auth-brand";
import { AuthInput } from "@/components/auth/auth-input";
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

      <form className="space-y-stack-md delay-100 fade-in-up">
        <AuthInput label="Full Name" icon="person" id="name" type="text" placeholder="Jane Doe" required />
        <AuthInput
          label="Email Address"
          icon="mail"
          id="email"
          type="email"
          placeholder="jane@example.com"
          required
        />
        <AuthInput
          label="Password"
          icon="lock"
          id="password"
          type="password"
          placeholder="••••••••"
          required
        />
        <AuthInput
          label="Confirm Password"
          icon="lock_reset"
          id="confirm-password"
          type="password"
          placeholder="••••••••"
          required
        />

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-body-md text-body-md font-semibold text-white primary-gradient-btn mt-stack-sm"
        >
          Create Account
        </button>
      </form>

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
