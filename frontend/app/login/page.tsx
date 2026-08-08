import Link from "next/link";
import type { Metadata } from "next";

import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthBrand } from "@/components/auth/auth-brand";
import { PasswordInput } from "@/components/auth/password-input";
import { SocialLoginButton } from "@/components/auth/social-login-button";

export const metadata: Metadata = {
  title: "Login - RecruitAI",
};

export default function LoginPage() {
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

      <form className="space-y-stack-md delay-100 fade-in-up">
        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-surface-variant" htmlFor="email">
            Email Address
          </label>
          <div className="relative">
            <span
              className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none"
              style={{ fontVariationSettings: "'FILL' 0" }}
            >
              mail
            </span>
            <input
              id="email"
              type="email"
              placeholder="name@company.com"
              required
              className="w-full bg-inverse-surface border border-outline/30 rounded-lg py-3 pl-10 pr-4 text-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 transition-all shadow-inner"
            />
          </div>
        </div>

        <div className="space-y-stack-sm">
          <div className="flex justify-between items-center">
            <label className="block font-label-sm text-label-sm text-surface-variant" htmlFor="password">
              Password
            </label>
            <Link
              href="#"
              className="font-label-sm text-label-sm text-primary-fixed hover:text-tertiary-fixed transition-colors"
            >
              Forgot password?
            </Link>
          </div>
          <PasswordInput id="password" placeholder="••••••••" required />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-lg font-body-md text-body-md font-semibold text-white primary-gradient-btn mt-stack-sm"
        >
          Login
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
