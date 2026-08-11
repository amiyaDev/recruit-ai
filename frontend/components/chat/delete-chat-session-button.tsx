"use client";

import { useState } from "react";

import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { useDeleteChatSession } from "@/hooks/chat/use-delete-chat-session";

export function DeleteChatSessionButton({ id, title }: { id: string; title: string }) {
  const [open, setOpen] = useState(false);
  const deleteSession = useDeleteChatSession();

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className="rounded-lg border border-destructive/30 text-destructive p-2 hover:bg-destructive/10 transition-colors disabled:opacity-60 shrink-0"
        aria-label="Delete conversation"
        disabled={deleteSession.isPending}
      >
        <span className="material-symbols-outlined text-[16px]">
          {deleteSession.isPending ? "hourglass_empty" : "delete"}
        </span>
      </button>

      <ConfirmDialog
        open={open}
        onOpenChange={setOpen}
        title="Delete this conversation?"
        description={`"${title}" and all its messages will be permanently removed. This can't be undone.`}
        confirmLabel="Delete conversation"
        destructive
        icon="delete"
        onConfirm={() => deleteSession.mutate(id)}
      />
    </>
  );
}
