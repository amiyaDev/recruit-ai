"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AuthInput } from "@/components/auth/auth-input";
import { PasswordInput } from "@/components/auth/password-input";
import { FormError } from "@/components/auth/form-error";
import { useLogin } from "@/hooks/auth/use-login";
import { getApiErrorMessage } from "@/lib/api-error";
import { loginSchema, type LoginFormValues } from "@/schemas/auth.schema";

export function LoginForm() {
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => login.mutate(values))}
      className="space-y-stack-md delay-100 fade-in-up"
      noValidate
    >
      <FormError message={login.isError ? getApiErrorMessage(login.error) : null} />

      <AuthInput
        label="Email Address"
        icon="mail"
        id="email"
        type="email"
        placeholder="name@company.com"
        error={errors.email?.message}
        {...register("email")}
      />

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
        <PasswordInput
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>

      <button
        type="submit"
        disabled={login.isPending}
        className="w-full py-3 rounded-lg font-body-md text-body-md font-semibold text-white primary-gradient-btn mt-stack-sm disabled:opacity-60 disabled:pointer-events-none"
      >
        {login.isPending ? "Logging in…" : "Login"}
      </button>
    </form>
  );
}
