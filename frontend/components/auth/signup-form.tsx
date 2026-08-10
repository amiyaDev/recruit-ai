"use client";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { AuthInput } from "@/components/auth/auth-input";
import { PasswordInput } from "@/components/auth/password-input";
import { FormError } from "@/components/auth/form-error";
import { useRegister } from "@/hooks/auth/use-register";
import { getApiErrorMessage } from "@/lib/api-error";
import { registerSchema, type RegisterFormValues } from "@/schemas/auth.schema";

export function SignUpForm() {
  const register_ = useRegister();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: yupResolver(registerSchema),
    mode: "onBlur",
  });

  return (
    <form
      onSubmit={handleSubmit((values) => {
        // confirmPassword is a frontend-only check — never sent to the API.
        const { confirmPassword: _confirmPassword, ...payload } = values;
        register_.mutate(payload);
      })}
      className="space-y-stack-md delay-100 fade-in-up"
      noValidate
    >
      <FormError message={register_.isError ? getApiErrorMessage(register_.error) : null} />

      <AuthInput
        label="Full Name"
        icon="person"
        id="name"
        type="text"
        placeholder="Jane Doe"
        error={errors.name?.message}
        {...register("name")}
      />
      <AuthInput
        label="Email Address"
        icon="mail"
        id="email"
        type="email"
        placeholder="jane@example.com"
        error={errors.email?.message}
        {...register("email")}
      />
      <div className="space-y-stack-sm">
        <label className="block font-label-sm text-label-sm text-surface-variant" htmlFor="password">
          Password
        </label>
        <PasswordInput
          id="password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
      </div>
      <div className="space-y-stack-sm">
        <label className="block font-label-sm text-label-sm text-surface-variant" htmlFor="confirm-password">
          Confirm Password
        </label>
        <PasswordInput
          id="confirm-password"
          icon="lock_reset"
          placeholder="••••••••"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
      </div>

      <button
        type="submit"
        disabled={register_.isPending}
        className="w-full py-3 rounded-lg font-body-md text-body-md font-semibold text-white primary-gradient-btn mt-stack-sm disabled:opacity-60 disabled:pointer-events-none"
      >
        {register_.isPending ? "Creating account…" : "Create Account"}
      </button>
    </form>
  );
}
