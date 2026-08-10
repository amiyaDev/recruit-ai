"use client";

import { useRef, useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { validateResumeFile } from "@/lib/resume-validation";
import { useUploadResume } from "@/hooks/resumes/use-upload-resume";

type StepState = "pending" | "active" | "done" | "error";

const STEPS: { key: string; label: string; icon: string }[] = [
  { key: "uploaded", label: "Uploaded", icon: "check" },
  { key: "parsing", label: "Parsing", icon: "document_scanner" },
  { key: "ready", label: "Ready", icon: "task_alt" },
];

function StepIcon({ state, icon }: { state: StepState; icon: string }) {
  const base = "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors";
  if (state === "done") {
    return (
      <div className={cn(base, "bg-primary border-primary text-white shadow-[0_0_10px_rgba(53,37,205,0.4)]")}>
        <span className="material-symbols-outlined text-[16px]">check</span>
      </div>
    );
  }
  if (state === "error") {
    return (
      <div className={cn(base, "bg-destructive border-destructive text-white")}>
        <span className="material-symbols-outlined text-[16px]">close</span>
      </div>
    );
  }
  if (state === "active") {
    return (
      <div className={cn(base, "bg-card border-primary text-primary animate-pulse")}>
        <span className="material-symbols-outlined text-[16px] animate-spin" style={{ animationDuration: "2s" }}>
          {icon}
        </span>
      </div>
    );
  }
  return (
    <div className={cn(base, "bg-muted border-border text-muted-foreground")}>
      <span className="material-symbols-outlined text-[16px]">{icon}</span>
    </div>
  );
}

export function ResumeUploader() {
  const upload = useUploadResume();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [clientError, setClientError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const isUploading = upload.isPending && upload.progress < 100;
  const isProcessing = upload.isPending && upload.progress >= 100;
  const isDone = upload.isSuccess;
  const parsedFailed = isDone && upload.data.status === "failed";
  const parsedOk = isDone && upload.data.status === "parsed";
  const hasError = upload.isError || parsedFailed;

  const bytesSent = isUploading ? false : upload.isPending || isDone || upload.isError;
  const responseReceived = isDone || upload.isError;

  const stepStates: StepState[] = [
    bytesSent ? "done" : isUploading ? "active" : "pending",
    responseReceived ? (parsedFailed || upload.isError ? "error" : "done") : isProcessing ? "active" : "pending",
    parsedOk ? "done" : parsedFailed || upload.isError ? "error" : "pending",
  ];

  const statusLabel = clientError
    ? "Invalid file"
    : upload.isError
    ? "Upload failed"
    : isUploading
    ? `Uploading… ${upload.progress}%`
    : isProcessing
    ? "Parsing resume…"
    : parsedOk
    ? "Parsed successfully"
    : parsedFailed
    ? "Parsing failed"
    : "Waiting for a file";

  const statusPillClass = hasError
    ? "text-destructive bg-destructive/10"
    : parsedOk
    ? "text-tertiary bg-tertiary-container/10"
    : "text-primary bg-primary/10";

  function handleFile(file: File) {
    const validationError = validateResumeFile(file);
    if (validationError) {
      setClientError(validationError);
      return;
    }
    setClientError(null);
    setFileName(file.name);
    upload.mutate(file);
  }

  function handleReset() {
    upload.reset();
    setClientError(null);
    setFileName(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  const busy = upload.isPending;
  const showResult = isDone || upload.isError;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-stack-lg">
      {/* Left: Dropzone + pipeline */}
      <div className="lg:col-span-7 flex flex-col gap-stack-lg">
        <div
          role="button"
          tabIndex={0}
          onClick={() => !busy && inputRef.current?.click()}
          onKeyDown={(e) => {
            if (!busy && (e.key === "Enter" || e.key === " ")) inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            if (!busy) setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (busy) return;
            const file = e.dataTransfer.files?.[0];
            if (file) handleFile(file);
          }}
          className={cn(
            "relative group h-72 md:h-80 rounded-xl",
            busy ? "cursor-wait" : "cursor-pointer",
            isDragging && "scale-[1.01]"
          )}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".pdf,.docx"
            className="hidden"
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
          />
          <div
            className={cn(
              "absolute inset-0 rounded-xl p-[2px] bg-gradient-to-br from-primary via-tertiary-fixed-dim to-secondary-container transition-opacity",
              isDragging || busy ? "opacity-100" : "opacity-70 group-hover:opacity-100"
            )}
          >
            <div className="absolute inset-0 bg-card rounded-xl h-full w-full" />
          </div>

          <div className="relative z-10 h-full flex flex-col items-center justify-center text-center gap-stack-md px-stack-lg">
            {!showResult ? (
              <>
                <div
                  className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full bg-primary/10 flex items-center justify-center transition-transform duration-500 ease-out",
                    !busy && "group-hover:scale-110"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[40px] md:text-[48px] text-primary",
                      busy && "animate-pulse"
                    )}
                  >
                    {busy ? "sync" : "cloud_upload"}
                  </span>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-foreground">
                    {busy ? fileName : "Drag & drop resume"}
                  </p>
                  <p className="font-body-md text-body-md text-muted-foreground mt-2">
                    {busy ? (
                      "Hang tight — this won't take long."
                    ) : (
                      <>
                        or <span className="text-primary underline underline-offset-4">browse files</span> (PDF,
                        DOCX — max 5MB)
                      </>
                    )}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div
                  className={cn(
                    "w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center",
                    parsedOk ? "bg-tertiary-container/10" : "bg-destructive/10"
                  )}
                >
                  <span
                    className={cn(
                      "material-symbols-outlined text-[40px] md:text-[48px]",
                      parsedOk ? "text-tertiary" : "text-destructive"
                    )}
                  >
                    {parsedOk ? "task_alt" : "error"}
                  </span>
                </div>
                <div>
                  <p className="font-headline-md text-headline-md text-foreground break-all">{fileName}</p>
                  <p className="font-body-md text-body-md text-muted-foreground mt-2">
                    {parsedOk
                      ? "Parsed successfully."
                      : parsedFailed
                      ? "We couldn't extract any text from this file."
                      : getApiErrorMessage(upload.error)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleReset();
                  }}
                  className="shadcn-btn-outline font-label-sm text-sm px-5 py-2 flex items-center gap-2"
                >
                  <span className="material-symbols-outlined text-[16px]">
                    {parsedOk ? "add" : "refresh"}
                  </span>
                  {parsedOk ? "Upload another" : "Try again"}
                </button>
              </>
            )}
          </div>
        </div>

        {clientError && <FormError message={clientError} />}

        <div className="shadcn-card rounded-xl p-stack-md flex flex-col gap-stack-md">
          <div className="flex justify-between items-center px-stack-sm">
            <span className="font-label-sm text-label-sm text-muted-foreground">Upload status</span>
            <span className={cn("font-label-sm text-label-sm px-3 py-1 rounded-full", statusPillClass)}>
              {statusLabel}
            </span>
          </div>
          <div className="relative flex justify-between items-center pt-stack-sm pb-1">
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-border -translate-y-1/2 z-0" />
            <div
              className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-primary to-tertiary-fixed-dim -translate-y-1/2 z-0 transition-all duration-500"
              style={{
                width:
                  stepStates[2] !== "pending"
                    ? "100%"
                    : stepStates[1] !== "pending"
                    ? "50%"
                    : stepStates[0] !== "pending"
                    ? "10%"
                    : "0%",
              }}
            />
            {STEPS.map((step, i) => (
              <div key={step.key} className="relative z-10 flex flex-col items-center gap-2">
                <StepIcon state={stepStates[i]} icon={step.icon} />
                <span
                  className={cn(
                    "font-label-sm text-label-sm",
                    stepStates[i] === "pending" ? "text-muted-foreground" : "text-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right: live analysis */}
      <div className="lg:col-span-5">
        <div className="shadcn-card rounded-xl p-stack-lg h-full flex flex-col">
          <h3 className="font-headline-md text-headline-md text-foreground mb-stack-md flex items-center gap-2">
            <span className="material-symbols-outlined text-primary">troubleshoot</span>
            Live analysis
          </h3>

          {parsedOk ? (
            <div className="flex-1 flex flex-col gap-stack-md">
              <div className="space-y-stack-sm">
                <div className="font-label-sm text-label-sm text-muted-foreground mb-2">
                  IDENTIFIED CANDIDATE
                </div>
                <div className="bg-muted/50 p-stack-sm rounded-lg flex items-center gap-stack-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-secondary shrink-0">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <span className="font-body-md text-sm text-foreground truncate">
                    {upload.data.parsed_data?.email ?? "Not detected"}
                  </span>
                </div>
                <div className="bg-muted/50 p-stack-sm rounded-lg flex items-center gap-stack-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary shrink-0">
                    <span className="material-symbols-outlined">call</span>
                  </div>
                  <span className="font-body-md text-sm text-foreground truncate">
                    {upload.data.parsed_data?.phone ?? "Not detected"}
                  </span>
                </div>
              </div>

              <div className="mt-stack-md">
                <div className="font-label-sm text-label-sm text-muted-foreground mb-stack-sm">
                  DETECTED SKILLS ({upload.data.parsed_data?.skills.length ?? 0})
                </div>
                {upload.data.parsed_data?.skills.length ? (
                  <div className="flex flex-wrap gap-2">
                    {upload.data.parsed_data.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary font-label-sm text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="font-body-md text-sm text-muted-foreground">
                    No skills from our curated list were detected in this resume.
                  </p>
                )}
              </div>

              <div className="mt-auto pt-stack-lg flex flex-col gap-2">
                <Link
                  href={`/resumes/${upload.data.id}`}
                  className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2"
                >
                  View resume details
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col gap-stack-md opacity-80">
              <div className="space-y-stack-sm">
                <div className="font-label-sm text-label-sm text-muted-foreground mb-2">
                  IDENTIFIED CANDIDATE
                </div>
                <div className="bg-muted/50 p-stack-sm rounded-lg flex items-center gap-stack-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">person</span>
                  </div>
                  <div className="h-4 w-32 bg-muted rounded animate-pulse" />
                </div>
                <div className="bg-muted/50 p-stack-sm rounded-lg flex items-center gap-stack-sm">
                  <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center text-secondary">
                    <span className="material-symbols-outlined">mail</span>
                  </div>
                  <div className="h-4 w-48 bg-muted rounded animate-pulse" />
                </div>
              </div>

              <div className="mt-stack-md">
                <div className="font-label-sm text-label-sm text-muted-foreground mb-stack-sm">
                  DETECTED SKILLS
                </div>
                <div className="flex flex-wrap gap-2">
                  {[20, 24, 16, 28, 20].map((w, i) => (
                    <div key={i} className="h-8 rounded-full bg-muted animate-pulse" style={{ width: w * 4 }} />
                  ))}
                </div>
              </div>

              <div className="mt-auto pt-stack-lg flex flex-col items-center gap-2">
                <div className="relative w-28 h-28 flex items-center justify-center">
                  <svg className="w-full h-full -rotate-90 absolute inset-0 text-border" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" fill="none" r="45" stroke="currentColor" strokeWidth="8" />
                  </svg>
                  <div className="text-center">
                    <span className="font-headline-md text-headline-md text-muted-foreground block">---</span>
                  </div>
                </div>
                <span className="font-label-sm text-label-sm text-muted-foreground text-center">
                  {parsedFailed || upload.isError
                    ? "Analysis unavailable for this file."
                    : "Analysis appears once a resume finishes parsing"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
