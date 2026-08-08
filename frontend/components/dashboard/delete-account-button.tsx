"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteAccountButton() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="w-fit rounded-lg border border-destructive/30 text-destructive px-4 py-2 text-sm font-medium hover:bg-destructive/10 transition-colors mt-2"
      >
        Delete account
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete your account?"
        description="This permanently removes your resumes, jobs, and analysis history. This can't be undone."
        confirmLabel="Delete account"
        destructive
        icon="warning"
        onConfirm={() => router.push("/login")}
      />
    </>
  );
}
