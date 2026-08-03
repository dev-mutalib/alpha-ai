'use client';

import { useMemo, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatWindow } from '@/components/chat/chat-window';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import type { ChatMessage } from '@/components/chat/message';

export default function ChatPage() {
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error } = useChat();

  const isLoading = status === 'submitted' || status === 'streaming';
  const showTypingIndicator = isLoading && messages.length > 0;

  const onSuggestion = useMemo(
    () => (text: string) => {
      setInput(text);
    },
    [],
  );

  const submit = () => {
    if (!input.trim()) return;
    sendMessage({ text: input });
    setInput('');
  };

  return (
    <div className="flex h-full w-full flex-col">
      {error ? (
        <div className="border-b border-destructive/30 bg-destructive/10 px-5 py-3 text-sm text-destructive sm:px-8">
          {error.message || 'Something went wrong while connecting to the AI model.'}
        </div>
      ) : null}

      <ChatWindow messages={messages as ChatMessage[]} onSuggestion={onSuggestion} />

      {showTypingIndicator ? (
        <div className="mx-auto w-full max-w-3xl px-5 pb-3 sm:px-8">
          <TypingIndicator />
        </div>
      ) : null}

      <ChatInput
        value={input}
        onChange={(value) => {
          setInput(value);
        }}
        onSubmit={() => submit()}
      />
    </div>
  );
}
