"use client";

import { useState } from "react";
import Link from "next/link";

import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useChatSessions } from "@/hooks/chat/use-chat-sessions";
import { useCreateChatSession } from "@/hooks/chat/use-create-chat-session";
import { DeleteChatSessionButton } from "@/components/chat/delete-chat-session-button";

const PAGE_SIZE = 10;

export function ChatSessionsList() {
  const [page, setPage] = useState(0);
  const { data: sessions, isLoading, isFetching, isError, error } = useChatSessions({
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE,
  });
  const createSession = useCreateChatSession();

  const hasNextPage = !isLoading && (sessions?.length ?? 0) === PAGE_SIZE;
  const showPagination = page > 0 || hasNextPage;

  return (
    <div className="flex flex-col gap-stack-lg">
      <header className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-stack-sm">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-foreground">
            AI Career Chat
          </h2>
          <p className="font-body-md text-body-md text-muted-foreground mt-2">
            Talk through resume edits, career decisions, and interview prep with an assistant
            grounded in your resume.
          </p>
        </div>
        <button
          type="button"
          onClick={() => createSession.mutate({})}
          disabled={createSession.isPending}
          className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 w-full sm:w-auto disabled:opacity-60 disabled:pointer-events-none"
        >
          <span className="material-symbols-outlined text-[18px]">add_comment</span>
          {createSession.isPending ? "Starting…" : "New chat"}
        </button>
      </header>

      {createSession.isError && <FormError message={getApiErrorMessage(createSession.error)} />}

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {[0, 1].map((i) => (
            <div key={i} className="shadcn-card rounded-xl p-stack-md h-24 animate-pulse" />
          ))}
        </div>
      ) : isError ? (
        <FormError message={getApiErrorMessage(error)} />
      ) : sessions && sessions.length === 0 ? (
        <div className="shadcn-card rounded-xl p-stack-lg flex flex-col items-center text-center gap-3 py-16">
          <span className="material-symbols-outlined text-primary text-[40px]">forum</span>
          <p className="font-body-md text-sm font-semibold text-foreground">
            {page > 0 ? "No more conversations" : "No conversations yet"}
          </p>
          <p className="font-body-md text-sm text-muted-foreground max-w-sm">
            {page > 0
              ? "You've reached the end of your conversation history."
              : "Start a new chat and anchor it to a resume for personalized career guidance."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {sessions?.map((session) => (
            <div key={session.id} className="shadcn-card rounded-xl p-stack-md flex items-start gap-4">
              <Link href={`/chat/${session.id}`} className="flex items-start gap-4 flex-1 min-w-0">
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-sm font-semibold text-foreground truncate">
                    {session.title ?? "New conversation"}
                  </p>
                  {session.resume_id && (
                    <p className="font-label-sm text-[11px] text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-full mt-1">
                      Resume context
                    </p>
                  )}
                  <p className="font-body-md text-[11px] text-muted-foreground/70 mt-2">
                    {new Date(session.created_at).toLocaleDateString()}
                  </p>
                </div>
              </Link>
              <DeleteChatSessionButton id={session.id} title={session.title ?? "New conversation"} />
            </div>
          ))}
        </div>
      )}

      {showPagination && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0 || isFetching}
            className="font-label-sm text-sm px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Previous
          </button>
          <span className="font-label-sm text-xs text-muted-foreground">Page {page + 1}</span>
          <button
            type="button"
            onClick={() => setPage((p) => p + 1)}
            disabled={!hasNextPage || isFetching}
            className="font-label-sm text-sm px-4 py-2 rounded-lg text-muted-foreground hover:bg-muted disabled:opacity-40 disabled:pointer-events-none transition-colors flex items-center gap-1.5"
          >
            Next
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </button>
        </div>
      )}
    </div>
  );
}
