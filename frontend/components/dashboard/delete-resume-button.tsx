"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteResume } from "@/hooks/resumes/use-delete-resume";

export function DeleteResumeButton({ id, filename }: { id: string; filename: string }) {
  const [open, setOpen] = useState(false);
  const deleteResume = useDeleteResume();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-destructive/30 text-destructive px-3 py-2 hover:bg-destructive/10 transition-colors disabled:opacity-60"
        aria-label="Delete resume"
        disabled={deleteResume.isPending}
      >
        <span className="material-symbols-outlined text-[18px]">
          {deleteResume.isPending ? "hourglass_empty" : "delete"}
        </span>
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this resume?"
        description={`"${filename}" and all associated ATS scores will be permanently removed. This can't be undone.`}
        confirmLabel="Delete resume"
        destructive
        icon="delete"
        onConfirm={() => deleteResume.mutate(id)}
      />
    </>
  );
}
