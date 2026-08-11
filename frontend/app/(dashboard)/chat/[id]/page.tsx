import type { Metadata } from "next";

import { ChatConversation } from "@/components/chat/chat-conversation";

export const metadata: Metadata = {
  title: "Chat - RecruitAI",
};

export default async function ChatConversationPage({ params }: PageProps<"/chat/[id]">) {
  const { id } = await params;
  return <ChatConversation sessionId={id} />;
}
