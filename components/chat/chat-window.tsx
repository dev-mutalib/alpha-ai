'use client';

import { ArrowUpRight, FileText, Lightbulb, PenLine, Search } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

import { MessageList, type ChatMessage } from './message';

const suggestions = [
  {
    icon: PenLine,
    title: 'Write something',
    text: 'Draft, rewrite, or brainstorm an idea',
  },
  {
    icon: Lightbulb,
    title: 'Think it through',
    text: 'Explore a problem from a new angle',
  },
  {
    icon: Search,
    title: 'Learn something',
    text: 'Get a clear explanation of any topic',
  },
  {
    icon: FileText,
    title: 'Work with files',
    text: 'Summarize or pull insights from a file',
  },
];

const BOTTOM_THRESHOLD = 120;

export interface ChatWindowProps {
  messages: ChatMessage[];
  onSuggestion: (text: string) => void;
  isStreaming?: boolean;
}

export function ChatWindow({ messages, onSuggestion, isStreaming = false }: ChatWindowProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  /**
   * Whether the user wants the viewport to follow
   * the currently generated response.
   */
  const shouldAutoScrollRef = useRef(true);

  /**
   * requestAnimationFrame ID used while streaming.
   */
  const animationFrameRef = useRef<number | null>(null);

  /**
   * Scroll immediately to the bottom.
   *
   * Do NOT use smooth scrolling here.
   * Streaming can update many times per second and
   * smooth scrolling causes the viewport to lag behind.
   */
  const scrollToBottom = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    container.scrollTop = container.scrollHeight;
  }, []);

  /**
   * Determine whether the user is close enough to the
   * bottom that automatic scrolling should remain active.
   */
  const isNearBottom = useCallback(() => {
    const container = scrollContainerRef.current;

    if (!container) return true;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    return distanceFromBottom <= BOTTOM_THRESHOLD;
  }, []);

  /**
   * Track manual scrolling.
   *
   * If the user deliberately scrolls upward, stop following
   * the response. When they return near the bottom, resume.
   */
  useEffect(() => {
    const container = scrollContainerRef.current;

    if (!container) return;

    const handleScroll = () => {
      shouldAutoScrollRef.current = isNearBottom();
    };

    container.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      container.removeEventListener('scroll', handleScroll);
    };
  }, [isNearBottom]);

  /**
   * CONTINUOUS STREAMING AUTO-SCROLL
   *
   * While the LLM is streaming, keep the viewport pinned
   * to the bottom on every browser animation frame.
   *
   * This is the important difference from the previous
   * implementation.
   */
  useEffect(() => {
    if (!isStreaming) {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);

        animationFrameRef.current = null;
      }

      return;
    }

    const followStream = () => {
      if (shouldAutoScrollRef.current) {
        scrollToBottom();
      }

      animationFrameRef.current = requestAnimationFrame(followStream);
    };

    animationFrameRef.current = requestAnimationFrame(followStream);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);

        animationFrameRef.current = null;
      }
    };
  }, [isStreaming, scrollToBottom]);

  /**
   * When a new user message is submitted, immediately
   * move the viewport to the bottom.
   *
   * We detect this through the message count.
   */
  useEffect(() => {
    if (!messages.length) return;

    shouldAutoScrollRef.current = true;

    const frame = requestAnimationFrame(() => {
      scrollToBottom();
    });

    return () => {
      cancelAnimationFrame(frame);
    };
  }, [messages.length, scrollToBottom]);

  return (
    <div
      ref={scrollContainerRef}
      className="
        min-h-0
        flex-1
        overflow-y-auto
        overscroll-contain
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-4xl
          px-4
          py-6
          sm:px-6
          lg:px-8
        "
      >
        {messages.length ? (
          <MessageList messages={messages} />
        ) : (
          <div
            className="
              flex
              min-h-[calc(100vh-220px)]
              flex-col
              justify-center
            "
          >
            <div className="mx-auto w-full max-w-3xl">
              <div className="mb-8">
                <h1
                  className="
                    text-3xl
                    font-semibold
                    tracking-tight
                    text-foreground
                  "
                >
                  How can I help you today?
                </h1>

                <p
                  className="
                    mt-2
                    text-sm
                    text-muted-foreground
                  "
                >
                  Start with a thought, a question, or a little bit of context.
                </p>
              </div>

              <div
                className="
                  grid
                  grid-cols-1
                  gap-3
                  sm:grid-cols-2
                "
              >
                {suggestions.map(({ icon: Icon, title, text }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => onSuggestion(text)}
                    className="
                        group
                        flex
                        items-start
                        gap-4
                        rounded-2xl
                        border
                        border-border
                        bg-card/60
                        p-4
                        text-left
                        transition-colors
                        hover:bg-card
                      "
                  >
                    <span
                      className="
                          flex
                          size-9
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          bg-background
                          text-primary
                        "
                    >
                      <Icon size={17} />
                    </span>

                    <span>
                      <span
                        className="
                            block
                            text-sm
                            font-medium
                            text-foreground
                          "
                      >
                        {title}
                      </span>

                      <span
                        className="
                            mt-1
                            block
                            text-xs
                            leading-5
                            text-muted-foreground
                          "
                      >
                        {text}
                      </span>
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="
                          ml-auto
                          text-muted-foreground
                          opacity-0
                          transition-opacity
                          group-hover:opacity-100
                        "
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
