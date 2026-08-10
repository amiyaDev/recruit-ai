"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";

interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: string;
}

export function PasswordInput({ error, icon = "lock", className, ...props }: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div>
      <div className="relative">
        <span
          className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline-variant pointer-events-none"
          style={{ fontVariationSettings: "'FILL' 0" }}
        >
          {icon}
        </span>
        <input
          type={visible ? "text" : "password"}
          aria-invalid={Boolean(error)}
          className={cn(
            "w-full bg-inverse-surface border border-outline/30 rounded-lg py-3 pl-10 pr-10 text-surface placeholder:text-outline-variant focus:outline-none focus:border-primary-fixed focus:ring-2 focus:ring-primary-fixed/20 transition-all shadow-inner",
            error && "border-error focus:border-error focus:ring-error/20",
            className
          )}
          {...props}
        />
        <button
          type="button"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? "Hide password" : "Show password"}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-outline-variant hover:text-surface transition-colors"
        >
          <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 0" }}>
            {visible ? "visibility_off" : "visibility"}
          </span>
        </button>
      </div>
      {error && <p className="font-label-sm text-label-sm text-error mt-stack-sm">{error}</p>}
    </div>
  );
}
