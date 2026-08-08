import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { cn } from "@/lib/utils";
import { getChatById, getResumeById } from "@/constants/dashboard-mock-data";

export async function generateMetadata({
  params,
}: PageProps<"/chat/[id]">): Promise<Metadata> {
  const { id } = await params;
  const chat = getChatById(id);
  return { title: chat ? `${chat.title} - RecruitAI` : "Chat - RecruitAI" };
}

export default async function ChatConversationPage({ params }: PageProps<"/chat/[id]">) {
  const { id } = await params;
  const chat = getChatById(id);
  if (!chat) notFound();

  const resume = chat.resumeId ? getResumeById(chat.resumeId) : undefined;

  return (
    <div className="flex flex-col gap-stack-md h-full">
      <div className="flex items-center justify-between gap-2">
        <Link
          href="/chat"
          className="font-label-sm text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 w-fit"
        >
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          All conversations
        </Link>
        {resume && (
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
            <span className="material-symbols-outlined text-primary text-[16px]">document_scanner</span>
            <span className="font-label-sm text-label-sm text-primary hidden sm:inline">
              Context: {resume.filename}
            </span>
            <div className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse" />
          </div>
        )}
      </div>

      <div className="shadcn-card rounded-2xl flex flex-col overflow-hidden flex-1">
        <div className="flex-1 overflow-y-auto px-stack-md md:px-stack-lg py-stack-lg flex flex-col gap-stack-md max-h-[55vh]">
          {chat.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "flex items-start gap-3",
                message.role === "user" && "justify-end"
              )}
            >
              {message.role === "assistant" && (
                <div className="w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
                  <span
                    className="material-symbols-outlined text-[16px] text-primary"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    smart_toy
                  </span>
                </div>
              )}

              <div className={cn("flex flex-col gap-2 max-w-[85%] lg:max-w-[70%]", message.role === "user" && "items-end")}>
                <div
                  className={cn(
                    "p-4 rounded-2xl text-sm",
                    message.role === "assistant"
                      ? "bg-muted/70 rounded-tl-sm text-foreground"
                      : "bg-gradient-to-r from-primary to-tertiary-container text-white rounded-tr-sm shadow-[0_10px_25px_rgba(53,37,205,0.15)]"
                  )}
                >
                  {message.content}
                </div>
                {message.suggestionChips && (
                  <div className="flex flex-wrap gap-2">
                    {message.suggestionChips.map((chip) => (
                      <button
                        key={chip}
                        type="button"
                        className="px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 hover:bg-primary/20 transition-colors font-label-sm text-xs text-primary"
                      >
                        {chip}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {message.role === "user" && (
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0 text-white font-label-sm text-[11px] font-bold">
                  You
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="shrink-0 p-stack-md border-t border-border bg-muted/20">
          <div className="relative flex items-center bg-background rounded-full border border-border focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all pr-2 pl-5 py-1">
            <input
              type="text"
              placeholder="Type your message or ask for suggestions..."
              className="flex-1 bg-transparent border-none text-sm text-foreground placeholder:text-muted-foreground py-2.5 outline-none"
            />
            <button
              type="button"
              className="w-10 h-10 rounded-full bg-gradient-to-r from-primary to-secondary flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-transform shrink-0"
              aria-label="Send message"
            >
              <span className="material-symbols-outlined text-white text-[18px] pl-0.5">send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
