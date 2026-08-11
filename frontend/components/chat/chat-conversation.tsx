"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { isAxiosError } from "axios";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { cn } from "@/lib/utils";
import { FormError } from "@/components/ui/form-error";
import { getApiErrorMessage } from "@/lib/api-error";
import { useChatMessages } from "@/hooks/chat/use-chat-messages";
import { useChatStream } from "@/hooks/chat/use-chat-stream";
import type { ChatRole } from "@/types/chat.types";

const STARTER_PROMPTS = [
  "Improve my resume",
  "Know my mistakes",
  "Study roadmap",
  "Future career path",
];

const MARKDOWN_COMPONENTS: Components = {
  p: ({ ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
  strong: ({ ...props }) => <strong className="font-semibold" {...props} />,
  ul: ({ ...props }) => <ul className="list-disc pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
  ol: ({ ...props }) => <ol className="list-decimal pl-5 mb-2 space-y-1 last:mb-0" {...props} />,
  li: ({ ...props }) => <li {...props} />,
  h1: ({ ...props }) => <h3 className="font-semibold text-base mt-3 mb-1 first:mt-0" {...props} />,
  h2: ({ ...props }) => <h3 className="font-semibold text-base mt-3 mb-1 first:mt-0" {...props} />,
  h3: ({ ...props }) => <h4 className="font-semibold text-sm mt-2 mb-1 first:mt-0" {...props} />,
  code: ({ ...props }) => <code className="bg-black/10 dark:bg-white/10 rounded px-1 py-0.5 text-[13px]" {...props} />,
  a: ({ ...props }) => <a className="underline text-primary" target="_blank" rel="noopener noreferrer" {...props} />,
};

function CopyButton({ content, align }: { content: string; align: "start" | "end" }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1500);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        align === "end" && "self-end",
        "opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity text-muted-foreground hover:text-primary flex items-center gap-1 px-1.5 py-0.5 rounded"
      )}
      aria-label="Copy message"
    >
      <span className="material-symbols-outlined text-[14px]">{copied ? "check" : "content_copy"}</span>
      <span className="font-label-sm text-[11px]">{copied ? "Copied" : "Copy"}</span>
    </button>
  );
}

function MessageBubble({ role, content }: { role: ChatRole; content: string }) {
  return (
    <div className={cn("group flex items-start gap-3", role === "user" && "justify-end")}>
      {role === "assistant" && (
        <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
          <span
            className="material-symbols-outlined text-[16px] text-primary"
            style={{ fontVariationSettings: "'FILL' 1" }}
          >
            smart_toy
          </span>
        </div>
      )}

      <div className={cn("flex flex-col gap-1 max-w-[85%] lg:max-w-[70%]", role === "user" && "items-end")}>
        <div
          className={cn(
            "p-4 rounded-2xl text-sm",
            role === "assistant"
              ? "bg-muted/70 rounded-tl-sm text-foreground"
              : "bg-gradient-to-r from-primary to-tertiary-container text-white rounded-tr-sm shadow-[0_10px_25px_rgba(53,37,205,0.15)]"
          )}
        >
          {role === "assistant" ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} components={MARKDOWN_COMPONENTS}>
              {content}
            </ReactMarkdown>
          ) : (
            <p className="whitespace-pre-wrap">{content}</p>
          )}
        </div>
        <CopyButton content={content} align={role === "user" ? "end" : "start"} />
      </div>

      {role === "user" && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 text-white font-label-sm text-[11px] font-bold">
          You
        </div>
      )}
    </div>
  );
}

export function ChatConversation({ sessionId }: { sessionId: string }) {
  const { data: messages, isLoading, isError, error } = useChatMessages(sessionId);
  const { streamingText, isStreaming, error: streamError, sendMessage } = useChatStream(sessionId);
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingText]);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-stack-md h-full">
        <div className="h-5 w-40 rounded bg-muted animate-pulse" />
        <div className="shadcn-card rounded-2xl flex-1 animate-pulse" />
      </div>
    );
  }

  if (isError || !messages) {
    const notFound = isAxiosError(error) && error.response?.status === 404;
    return (
      <div className="flex flex-col gap-stack-lg">
        <Link
          href="/chat"
          className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          All conversations
        </Link>
        <FormError
          message={
            notFound ? "This conversation doesn't exist or you don't have access to it." : getApiErrorMessage(error)
          }
        />
      </div>
    );
  }

  async function handleSend(content: string) {
    const text = content.trim();
    if (!text || isStreaming) return;
    setDraft("");
    await sendMessage(text);
  }

  return (
    <div className="flex flex-col gap-stack-md h-full">
      <Link
        href="/chat"
        className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
      >
        <span className="material-symbols-outlined text-[18px]">arrow_back</span>
        All conversations
      </Link>

      <div className="shadcn-card rounded-2xl flex flex-col overflow-hidden flex-1">
        <div className="flex-1 overflow-y-auto px-stack-md md:px-stack-lg py-stack-lg flex flex-col gap-stack-md max-h-[55vh]">
          {messages.length === 0 && !isStreaming && (
            <div className="flex flex-col items-center text-center gap-stack-sm py-8">
              <span className="material-symbols-outlined text-primary text-[32px]">smart_toy</span>
              <p className="font-body-md text-sm text-muted-foreground max-w-sm">
                Ask about resume mistakes, concepts to study, or where your skills could take you next.
              </p>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {STARTER_PROMPTS.map((chip) => (
                  <button
                    key={chip}
                    type="button"
                    onClick={() => handleSend(chip)}
                    className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors font-label-sm text-xs text-primary"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <MessageBubble key={message.id} role={message.role} content={message.content} />
          ))}

          {isStreaming && <MessageBubble role="assistant" content={streamingText || "…"} />}

          <div ref={bottomRef} />
        </div>

        {streamError && (
          <div className="px-stack-md md:px-stack-lg pb-2">
            <FormError message={streamError} />
          </div>
        )}

        <div className="shrink-0 p-stack-md border-t border-border bg-muted/20">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void handleSend(draft);
            }}
            className="relative flex items-center bg-background rounded-full border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all pr-2 pl-5 py-1"
          >
            <input
              type="text"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              disabled={isStreaming}
              placeholder="Type your message or ask for suggestions..."
              className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground py-2.5 outline-none disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={isStreaming || !draft.trim()}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0 disabled:opacity-60 disabled:pointer-events-none disabled:hover:scale-100"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-white text-[18px] pl-0.5">
                {isStreaming ? "progress_activity" : "send"}
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
