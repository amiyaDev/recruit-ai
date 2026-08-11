import type { Metadata } from "next";

import { ChatSessionsList } from "@/components/chat/chat-sessions-list";

export const metadata: Metadata = {
  title: "AI Career Chat - RecruitAI",
};

export default function ChatListPage() {
  return <ChatSessionsList />;
}
