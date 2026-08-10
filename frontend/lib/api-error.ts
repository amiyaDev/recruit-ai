import { isAxiosError } from "axios";

import type { ApiAppError, ApiValidationError } from "@/types/auth.types";

/**
 * Normalizes the backend's two distinct error shapes into one message:
 * - AppError subclasses -> { error: { code, message } }
 * - Raw Pydantic/FastAPI validation errors (422) -> { detail: string | [...] }
 */
export function getApiErrorMessage(error: unknown, fallback = "Something went wrong. Please try again."): string {
  if (!isAxiosError(error)) {
    return error instanceof Error ? error.message : fallback;
  }

  if (!error.response) {
    return "Can't reach the server. Check your connection and try again.";
  }

  const body = error.response.data as Partial<ApiAppError & ApiValidationError> | undefined;

  if (body?.error?.message) {
    return body.error.message;
  }

  if (typeof body?.detail === "string") {
    return body.detail;
  }

  if (Array.isArray(body?.detail) && body.detail.length > 0) {
    return body.detail.map((issue) => issue.msg).join(" ");
  }

  return fallback;
}
