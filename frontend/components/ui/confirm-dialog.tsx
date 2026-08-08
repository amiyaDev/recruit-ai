"use client";

import { AlertDialog } from "@base-ui/react/alert-dialog";

import { cn } from "@/lib/utils";

export interface ConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  icon?: string;
  onConfirm: () => void;
}

/**
 * Generic "are you sure?" modal. Callers own their `open` state and pass a
 * plain trigger button elsewhere — this component only renders the dialog.
 */
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  icon = "help",
  onConfirm,
}: ConfirmDialogProps) {
  return (
    <AlertDialog.Root open={open} onOpenChange={onOpenChange}>
      <AlertDialog.Portal>
        <AlertDialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm data-open:animate-in data-open:fade-in-0 data-closed:animate-out data-closed:fade-out-0" />
        <AlertDialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card text-card-foreground p-stack-lg shadow-2xl ring-1 ring-foreground/10 outline-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95">
          <div
            className={cn(
              "w-11 h-11 rounded-full flex items-center justify-center mb-stack-md",
              destructive ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}
          >
            <span className="material-symbols-outlined text-[22px]">{icon}</span>
          </div>

          <AlertDialog.Title className="font-headline-md text-headline-md text-foreground">
            {title}
          </AlertDialog.Title>

          {description && (
            <AlertDialog.Description className="font-body-md text-sm text-muted-foreground mt-2">
              {description}
            </AlertDialog.Description>
          )}

          <div className="flex justify-end gap-3 mt-stack-lg">
            <AlertDialog.Close className="font-label-sm text-sm px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted transition-colors">
              {cancelLabel}
            </AlertDialog.Close>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                onOpenChange(false);
              }}
              className={cn(
                "font-label-sm text-sm px-5 py-2 rounded-lg font-semibold transition-colors",
                destructive
                  ? "bg-destructive text-white hover:bg-destructive/90"
                  : "shadcn-btn-primary"
              )}
            >
              {confirmLabel}
            </button>
          </div>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
