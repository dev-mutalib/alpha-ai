'use client';

import { useState } from 'react';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatWindow } from '@/components/chat/chat-window';
import { mockMessages, type ChatMessage } from '@/components/chat/message';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>(mockMessages);
  const [input, setInput] = useState('');
  const submit = () => {
    const content = input.trim();
    if (!content) return;
    setMessages((current) => [...current, { id: `${Date.now()}`, role: 'user', content, time: 'Just now' }]);
    setInput('');
  };
  return (
    <div className="flex flex-col h-full w-full">
      <ChatWindow messages={messages} onSuggestion={setInput} />
      <ChatInput value={input} onChange={setInput} onSubmit={submit} />
    </div>
  );
}
