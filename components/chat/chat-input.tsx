'use client';

import { useEffect, useRef } from 'react';
import { ArrowUp, Mic, Paperclip, Square } from 'lucide-react';

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  isLoading?: boolean;
  onStop?: () => void;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading = false,
  onStop,
}: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = 'auto';

    const nextHeight = Math.min(textarea.scrollHeight, 160);

    textarea.style.height = `${nextHeight}px`;
  }, [value]);

  const handleSubmit = () => {
    if (isLoading) {
      onStop?.();
      return;
    }

    if (!value.trim()) {
      return;
    }

    onSubmit();
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key !== 'Enter' || event.shiftKey) {
      return;
    }

    event.preventDefault();

    if (isLoading) {
      return;
    }

    if (!value.trim()) {
      return;
    }

    onSubmit();
  };

  return (
    <section className="w-full px-3 pb-3 sm:px-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          handleSubmit();
        }}
        className="
          mx-auto
          flex
          max-w-3xl
          flex-col
          rounded-3xl
          border
          border-border/50
          bg-card
          px-3
          py-2
          shadow-sm
        "
      >
        {/* Message field */}
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          placeholder="Message Alpha AI..."
          aria-label="Message Alpha AI"
          className="
            chat-input-textarea
            block
            w-full
            min-h-8
            max-h-40
            resize-none
            overflow-y-auto
            scrollbar-none
            border-0
            bg-transparent  
            px-1
            py-1
            text-sm
            leading-6
            text-foreground
            placeholder:text-muted-foreground

            outline-none
            ring-0
            shadow-none

            focus:border-0
            focus:outline-none
            focus:ring-0
            focus:shadow-none

            focus-visible:border-0
            focus-visible:outline-none
            focus-visible:ring-0
            focus-visible:shadow-none
          "
        />

        {/* Bottom toolbar */}
        <div className="mt-1 flex items-center justify-between">
          {/* Left controls */}
          <div className="flex items-center">
            <button
              type="button"
              aria-label="Attach file"
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-full
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
                focus:outline-none
                focus:ring-0
              "
            >
              <Paperclip size={18} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Use microphone"
              className="
                flex
                size-8
                items-center
                justify-center
                rounded-full
                text-muted-foreground
                transition-colors
                hover:bg-muted
                hover:text-foreground
                focus:outline-none
                focus:ring-0
              "
            >
              <Mic size={18} strokeWidth={1.8} />
            </button>
          </div>

          {/* Send / Stop */}
          <button
            type="submit"
            disabled={!value.trim() && !isLoading}
            aria-label={isLoading ? 'Stop generating' : 'Send message'}
            className={`
              flex
              size-8
              shrink-0
              items-center
              justify-center
              rounded-full
              transition-all
              duration-150
              focus:outline-none
              focus:ring-0

              ${
                isLoading
                  ? `
                    bg-foreground
                    text-background
                    hover:bg-foreground/80
                  `
                  : `
                    bg-foreground
                    text-background
                    hover:bg-foreground/80
                    disabled:bg-muted
                    disabled:text-muted-foreground
                    disabled:hover:bg-muted
                  `
              }
            `}
          >
            {isLoading ? (
              <Square size={11} strokeWidth={0} fill="currentColor" />
            ) : (
              <ArrowUp size={17} strokeWidth={2.2} />
            )}
          </button>
        </div>
      </form>

      {/* Disclaimer */}
      <p
        className="
          mx-auto
          mt-2
          max-w-3xl
          px-2
          text-center
          text-[10px]
          leading-4
          text-muted-foreground/70
        "
      >
        Alpha AI can make mistakes. Check important information.
      </p>
    </section>
  );
}
