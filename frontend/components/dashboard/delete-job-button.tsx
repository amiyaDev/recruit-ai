"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteJob } from "@/hooks/jobs/use-delete-job";

export function DeleteJobButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const deleteJob = useDeleteJob();

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="rounded-lg border border-destructive/30 text-destructive px-3 py-2 hover:bg-destructive/10 transition-colors disabled:opacity-60"
        aria-label="Delete job"
        disabled={deleteJob.isPending}
      >
        <span className="material-symbols-outlined text-[18px]">
          {deleteJob.isPending ? "hourglass_empty" : "delete"}
        </span>
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this job?"
        description={`"${title}" and all associated ATS scores will be permanently removed. This can't be undone.`}
        confirmLabel="Delete job"
        destructive
        icon="delete"
        onConfirm={() => deleteJob.mutate(id)}
      />
    </>
  );
}
