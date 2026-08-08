import { ChatClient } from '@/components/chat/chat-client';
import { getChatMessages } from '@/app/actions/chat';
import type { UIMessage } from 'ai';
import { notFound } from 'next/navigation';

export default async function ChatPageId(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;
  
  let dbMessages = [];
  try {
    dbMessages = await getChatMessages(id);
  } catch (err) {
    return notFound();
  }
  
  const initialMessages: UIMessage[] = dbMessages.map((msg) => ({
    id: msg.id,
    role: msg.role as UIMessage['role'],
    parts: [{ type: 'text', text: msg.content }],
  }));

  return <ChatClient key={id} id={id} initialMessages={initialMessages} />;
}
