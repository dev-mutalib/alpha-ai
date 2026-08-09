'use client';

import { useMemo, useState, useEffect } from 'react';
import { useChat } from '@ai-sdk/react';
import { ChatInput } from '@/components/chat/chat-input';
import { ChatWindow } from '@/components/chat/chat-window';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import type { ChatMessage } from '@/components/chat/message';
import { generateId, type UIMessage } from 'ai';

interface ChatClientProps {
  id?: string;
  initialMessages?: UIMessage[];
}

export function ChatClient({ id, initialMessages }: ChatClientProps) {
  const [chatId] = useState(() => id || generateId());
  const [input, setInput] = useState('');

  const { messages, sendMessage, status, error, stop } = useChat({
    id: chatId,
    messages: initialMessages,

    // @ts-ignore
    body: {
      id: chatId,
    },
  });

  /*
   * If this is a brand-new chat, update the browser URL
   * once the first message has been added.
   *
   * We intentionally use replaceState here so that the page
   * does not remount while the first response is streaming.
   */
  useEffect(() => {
    if (!id && messages.length > 0) {
      window.history.replaceState({}, '', `/chat/${chatId}`);
    }
  }, [id, messages.length, chatId]);

  /*
   * Notify the sidebar whenever the chat has been updated.
   *
   * This is important because window.history.replaceState()
   * does not trigger Next.js router state changes.
   *
   * The sidebar listens for this event and refetches the
   * user's chats without requiring a page refresh.
   */
  useEffect(() => {
    if (status === 'ready' && messages.length > 0) {
      window.dispatchEvent(
        new CustomEvent('alpha:chat-updated', {
          detail: {
            chatId,
          },
        }),
      );
    }
  }, [status, messages.length, chatId]);

  /*
   * AI SDK states:
   *
   * submitted -> request has been sent, waiting for stream
   * streaming -> response is actively streaming
   * ready     -> response has completed
   * error     -> request failed
   *
   * Both submitted and streaming mean the user should
   * see the Stop button.
   */
  const isLoading = status === 'submitted' || status === 'streaming';

  const showTypingIndicator = status === 'submitted' && messages.length > 0;

  const onSuggestion = useMemo(
    () => (text: string) => {
      setInput(text);
    },
    [],
  );

  const submit = () => {
    const message = input.trim();

    if (!message || isLoading) {
      return;
    }

    sendMessage({
      text: message,
    });

    setInput('');
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      {/* Error */}
      {error ? (
        <div className="mx-auto w-full max-w-3xl px-5 pt-4 sm:px-8">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error.message || 'Something went wrong while connecting to the AI model.'}
          </div>
        </div>
      ) : null}

      {/* Messages */}
      <ChatWindow
        messages={messages as ChatMessage[]}
        onSuggestion={onSuggestion}
        isStreaming={status === 'streaming'}
      />

      {/* Initial loading indicator */}
      {showTypingIndicator ? (
        <div className="mx-auto w-full max-w-3xl px-5 pb-3 sm:px-8">
          <TypingIndicator />
        </div>
      ) : null}

      {/* Chat input */}
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={submit}
        isLoading={isLoading}
        onStop={stop}
      />
    </div>
  );
}
