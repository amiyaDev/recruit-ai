import Link from "next/link";
import type { Metadata } from "next";

import { MOCK_CHATS, getResumeById } from "@/constants/dashboard-mock-data";

export const metadata: Metadata = {
  title: "AI Career Chat - RecruitAI",
};

export default function ChatListPage() {
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
          className="shadcn-btn-primary font-label-sm text-sm px-5 py-2.5 flex items-center justify-center gap-2 w-full sm:w-auto"
        >
          <span className="material-symbols-outlined text-[18px]">add_comment</span>
          New chat
        </button>
      </header>

      {MOCK_CHATS.length === 0 ? (
        <div className="shadcn-card rounded-xl p-stack-lg flex flex-col items-center text-center gap-3 py-16">
          <span className="material-symbols-outlined text-primary text-[40px]">forum</span>
          <p className="font-body-md text-sm font-semibold text-foreground">No conversations yet</p>
          <p className="font-body-md text-sm text-muted-foreground max-w-sm">
            Start a new chat and anchor it to a resume for personalized career guidance.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-md">
          {MOCK_CHATS.map((chat) => {
            const lastMessage = chat.messages[chat.messages.length - 1];
            const resume = chat.resumeId ? getResumeById(chat.resumeId) : undefined;
            return (
              <Link
                key={chat.id}
                href={`/chat/${chat.id}`}
                className="shadcn-card rounded-xl p-stack-md flex items-start gap-4"
              >
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-white text-[20px]">smart_toy</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-body-md text-sm font-semibold text-foreground truncate">{chat.title}</p>
                  {resume && (
                    <p className="font-label-sm text-[11px] text-primary bg-primary/10 inline-block px-2 py-0.5 rounded-full mt-1">
                      {resume.filename}
                    </p>
                  )}
                  <p className="font-body-md text-xs text-muted-foreground mt-2 line-clamp-2">
                    {lastMessage?.role === "user" ? "You: " : "AI: "}
                    {lastMessage?.content}
                  </p>
                  <p className="font-body-md text-[11px] text-muted-foreground/70 mt-2">
                    {new Date(chat.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
