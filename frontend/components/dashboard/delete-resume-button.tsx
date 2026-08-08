"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";

export function DeleteResumeButton({ filename }: { filename: string }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-destructive/30 text-destructive px-3 py-2 hover:bg-destructive/10 transition-colors"
        aria-label="Delete resume"
      >
        <span className="material-symbols-outlined text-[18px]">delete</span>
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this resume?"
        description={`"${filename}" and all associated ATS scores will be permanently removed. This can't be undone.`}
        confirmLabel="Delete resume"
        destructive
        icon="delete"
        onConfirm={() => router.push("/resumes")}
      />
    </>
  );
}
