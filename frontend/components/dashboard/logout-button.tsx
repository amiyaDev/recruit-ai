"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function LogoutButton({
  variant = "sidebar",
  className,
}: {
  variant?: "sidebar" | "icon";
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Log out"
        className={cn(
          variant === "sidebar"
            ? "flex items-center gap-3 px-4 py-2 rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors text-sm w-full"
            : "flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all duration-200",
          className
        )}
      >
        <span className="material-symbols-outlined text-[18px]">logout</span>
        {variant === "sidebar" && "Log out"}
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Log out of RecruitAI?"
        description="You'll need to sign in again to access your resumes, jobs, and analysis history."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        destructive
        icon="logout"
        onConfirm={() => router.push("/login")}
      />
    </>
  );
}
