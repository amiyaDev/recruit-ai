"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosProgressEvent } from "axios";

import { uploadResume } from "@/services/resume.service";
import { RESUMES_QUERY_KEY } from "@/hooks/resumes/use-resumes";

export function useUploadResume() {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => {
      setProgress(0);
      return uploadResume(file, (event: AxiosProgressEvent) => {
        if (event.total) {
          setProgress(Math.round((event.loaded / event.total) * 100));
        }
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RESUMES_QUERY_KEY });
    },
  });

  return {
    ...mutation,
    // Real byte-level progress while the file is in flight; once it hits
    // 100 the request is still pending (server parsing + embedding before
    // it can respond) — the UI treats that gap as the "Parsing" stage.
    progress,
    reset: () => {
      setProgress(0);
      mutation.reset();
    },
  };
}
