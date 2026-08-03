import { Check, Copy, Sparkles } from 'lucide-react';
import type { UIMessage } from '@ai-sdk/react';

export type ChatRole = 'user' | 'assistant' | 'system';

export type ChatMessage = UIMessage & {
  content?: string;
  time?: string;
};

function formatTime(time?: string) {
  return time ?? 'Just now';
}

function getMessageContent(message: ChatMessage): string {
  if (message.content) {
    return message.content;
  }
  if (Array.isArray(message.parts)) {
    return message.parts
      .map((part) => {
        if (part && typeof part === 'object' && 'type' in part && part.type === 'text' && 'text' in part) {
          return (part as { text: string }).text;
        }
        return '';
      })
      .join('');
  }
  return '';
}

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  const content = getMessageContent(message);

  return (
    <article className={`flex gap-3 ${isUser ? 'justify-end' : 'items-start'}`}>
      {!isUser && (
        <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
          <Sparkles size={15} />
        </span>
      )}
      <div className={`max-w-[min(680px,86%)] ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`whitespace-pre-line text-[15px] leading-7 ${isUser ? 'rounded-2xl rounded-tr-sm bg-foreground px-4 py-3 text-background' : 'text-body'}`}
        >
          {content}
        </div>
        <div
          className={`mt-2 flex items-center gap-2 text-[11px] text-muted-foreground ${isUser ? 'justify-end' : ''}`}
        >
          <span>{formatTime(message.time)}</span>
          {isUser ? (
            <Check size={13} className="text-accent-teal" />
          ) : (
            <button
              type="button"
              className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground"
              aria-label="Copy message"
            >
              <Copy size={13} />
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="group mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">
      {messages.map((message) => (
        <Message key={message.id} message={message} />
      ))}
    </div>
  );
}
