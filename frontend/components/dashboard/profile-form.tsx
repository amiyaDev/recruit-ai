"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import { FormError } from "@/components/ui/form-error";
import { useUser } from "@/context/user-context";
import { profileSchema, type ProfileFormValues } from "@/schemas/user.schema";

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ProfileForm() {
  const { user, isLoading, isError, errorMessage, updateProfile, isUpdating, updateErrorMessage } = useUser();
  const [justSaved, setJustSaved] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    values: user ? { name: user.name, email: user.email } : undefined,
  });

  // Clear the transient "saved" banner as soon as the user edits again.
  useEffect(() => {
    if (isDirty) setJustSaved(false);
  }, [isDirty]);

  const onSubmit = (values: ProfileFormValues) => {
    updateProfile(values);
    setJustSaved(true);
  };

  if (isLoading) {
    return (
      <section className="shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-muted shrink-0" />
          <div className="flex flex-col gap-2">
            <div className="h-4 w-40 rounded bg-muted" />
            <div className="h-3 w-56 rounded bg-muted" />
          </div>
        </div>
      </section>
    );
  }

  if (isError || !user) {
    return (
      <section className="shadcn-card rounded-xl p-stack-lg">
        <FormError message={errorMessage ?? "Couldn't load your profile. Please refresh the page."} />
      </section>
    );
  }

  return (
    <section className="shadcn-card rounded-xl p-stack-lg flex flex-col gap-stack-md">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white text-xl font-bold shrink-0">
          {getInitials(user.name)}
        </div>
        <div>
          <p className="font-body-md text-base font-semibold text-foreground">{user.name}</p>
          <p className="font-body-md text-sm text-muted-foreground">{user.email}</p>
          <div className="flex items-center gap-2 mt-1.5">
            <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-primary/10 text-primary capitalize">
              {user.role}
            </span>
            {user.is_verified && (
              <span className="font-label-sm text-[11px] px-2 py-0.5 rounded-full bg-tertiary-container/10 text-tertiary flex items-center gap-1">
                <span className="material-symbols-outlined text-[12px]">verified</span>
                Verified
              </span>
            )}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 sm:grid-cols-2 gap-stack-md pt-stack-sm border-t border-border"
        noValidate
      >
        {updateErrorMessage && (
          <div className="sm:col-span-2">
            <FormError message={updateErrorMessage} />
          </div>
        )}
        {justSaved && !isUpdating && !updateErrorMessage && (
          <div className="sm:col-span-2 flex items-center gap-2 rounded-lg border border-tertiary-container/30 bg-tertiary-container/10 px-4 py-3 text-tertiary">
            <span className="material-symbols-outlined text-[18px]">check_circle</span>
            <p className="font-body-md text-sm">Profile updated.</p>
          </div>
        )}

        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="settings-name">
            Full name
          </label>
          <input
            id="settings-name"
            type="text"
            aria-invalid={Boolean(errors.name)}
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all aria-invalid:border-destructive"
            {...register("name")}
          />
          {errors.name && <p className="font-label-sm text-label-sm text-destructive">{errors.name.message}</p>}
        </div>
        <div className="space-y-stack-sm">
          <label className="block font-label-sm text-label-sm text-muted-foreground" htmlFor="settings-email">
            Email address
          </label>
          <input
            id="settings-email"
            type="email"
            aria-invalid={Boolean(errors.email)}
            className="w-full bg-muted/50 border border-border rounded-lg py-2.5 px-4 text-sm text-foreground focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all aria-invalid:border-destructive"
            {...register("email")}
          />
          {errors.email && <p className="font-label-sm text-label-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="sm:col-span-2 flex justify-end gap-3 pt-stack-sm">
          {isDirty && (
            <button
              type="button"
              onClick={() => reset({ name: user.name, email: user.email })}
              className="font-label-sm text-sm text-muted-foreground hover:text-foreground px-4 py-2.5 transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            type="submit"
            disabled={isUpdating || !isDirty}
            className="shadcn-btn-primary font-label-sm text-sm px-6 py-2.5 disabled:opacity-60 disabled:pointer-events-none"
          >
            {isUpdating ? "Saving…" : "Save changes"}
          </button>
        </div>
      </form>
    </section>
  );
}
