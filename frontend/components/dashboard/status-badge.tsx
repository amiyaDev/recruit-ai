import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, string> = {
  uploaded: "bg-secondary/10 text-secondary border-secondary/20",
  parsing: "bg-primary/10 text-primary border-primary/20",
  parsed: "bg-tertiary-container/10 text-tertiary border-tertiary-container/20",
  ready: "bg-tertiary-container/10 text-tertiary border-tertiary-container/20",
  processing: "bg-primary/10 text-primary border-primary/20",
  pending: "bg-muted text-muted-foreground border-border",
  failed: "bg-destructive/10 text-destructive border-destructive/20",
  in_progress: "bg-primary/10 text-primary border-primary/20",
  completed: "bg-tertiary-container/10 text-tertiary border-tertiary-container/20",
};

const STATUS_LABELS: Record<string, string> = {
  uploaded: "Uploaded",
  parsing: "Parsing…",
  parsed: "Parsed",
  ready: "Ready",
  processing: "Processing…",
  pending: "Pending",
  failed: "Failed",
  in_progress: "In Progress",
  completed: "Completed",
};

const PULSING_STATUSES = new Set(["parsing", "processing"]);

export function StatusBadge({ status, className }: { status: string; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-label-sm text-[11px] font-semibold uppercase tracking-wide shrink-0",
        STATUS_STYLES[status] ?? "bg-muted text-muted-foreground border-border",
        className
      )}
    >
      <span className={cn("w-1.5 h-1.5 rounded-full bg-current", PULSING_STATUSES.has(status) && "animate-pulse")} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
