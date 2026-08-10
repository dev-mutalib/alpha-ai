'use client';

import {
  Archive,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MessageSquare,
  MoreHorizontal,
  Plus,
  Settings,
} from 'lucide-react';

import { ThemeToggle } from '@/components/theme-toggle';

import { useEffect, useState } from 'react';

import { getUserChats } from '@/app/actions/chat';

import Link from 'next/link';

import { useParams, useRouter } from 'next/navigation';

import { isToday, isYesterday, isThisWeek } from 'date-fns';

type ChatItem = {
  id: string;
  title: string;
  updatedAt: Date | null;
};

type ChatGroup = {
  label: string;
  chats: ChatItem[];
};

const groupChats = (chats: ChatItem[]): ChatGroup[] => {
  const groups: ChatGroup[] = [];

  const today = chats.filter((c) => c.updatedAt && isToday(new Date(c.updatedAt)));

  const yesterday = chats.filter((c) => c.updatedAt && isYesterday(new Date(c.updatedAt)));

  const thisWeek = chats.filter(
    (c) =>
      c.updatedAt &&
      isThisWeek(new Date(c.updatedAt)) &&
      !isToday(new Date(c.updatedAt)) &&
      !isYesterday(new Date(c.updatedAt)),
  );

  const older = chats.filter(
    (c) =>
      !c.updatedAt ||
      (!isThisWeek(new Date(c.updatedAt)) &&
        !isYesterday(new Date(c.updatedAt)) &&
        !isToday(new Date(c.updatedAt))),
  );

  if (today.length) {
    groups.push({
      label: 'Today',
      chats: today,
    });
  }

  if (yesterday.length) {
    groups.push({
      label: 'Yesterday',
      chats: yesterday,
    });
  }

  if (thisWeek.length) {
    groups.push({
      label: 'This Week',
      chats: thisWeek,
    });
  }

  if (older.length) {
    groups.push({
      label: 'Older',
      chats: older,
    });
  }

  return groups;
};

export interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  onNewChat: () => void;
}

export function Sidebar({ collapsed, onToggle, onNewChat }: SidebarProps) {
  const [chats, setChats] = useState<ChatItem[]>([]);

  const params = useParams();

  const currentChatId = params?.id as string | undefined;

  /*
   * Keep the active chat in local state as well.
   *
   * This is important for newly-created chats because
   * ChatClient uses history.replaceState(), which does not
   * immediately update Next.js useParams().
   */
  const [activeChatId, setActiveChatId] = useState<string | undefined>(currentChatId);

  const router = useRouter();

  /*
   * Keep the local active chat synchronized with
   * normal Next.js navigation.
   */
  useEffect(() => {
    setActiveChatId(currentChatId);
  }, [currentChatId]);

  /*
   * Fetch chats from the server.
   */
  const refreshChats = async () => {
    try {
      const data = await getUserChats();

      setChats(
        data.map((chat) => ({
          id: chat.id,
          title: chat.title,
          updatedAt: chat.updatedAt,
        })),
      );
    } catch (error) {
      console.error('[Alpha AI] Failed to fetch chat history:', error);
    }
  };

  /*
   * Initial chat-history fetch.
   *
   * Also refetch whenever normal Next.js navigation
   * changes the active chat.
   */
  useEffect(() => {
    refreshChats();
  }, [currentChatId]);

  /*
   * Listen for chat updates from ChatClient.
   *
   * ChatClient sends the actual generated chat ID after
   * the response finishes. We use that ID to immediately
   * mark the newly-created conversation as active.
   */
  useEffect(() => {
    const handleChatUpdated = (event: Event) => {
      const customEvent = event as CustomEvent<{
        chatId?: string;
      }>;

      const updatedChatId = customEvent.detail?.chatId;

      if (updatedChatId) {
        setActiveChatId(updatedChatId);
      }

      refreshChats();
    };

    window.addEventListener('alpha:chat-updated', handleChatUpdated);

    return () => {
      window.removeEventListener('alpha:chat-updated', handleChatUpdated);
    };
  }, []);

  const chatGroups = groupChats(chats);

  return (
    <>
      {!collapsed && (
        <div
          className="fixed inset-0 z-30 bg-background/60 backdrop-blur-sm md:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      <aside
        className={`group/sidebar fixed inset-y-0 left-0 z-40 flex w-71 shrink-0 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-out md:relative md:z-auto md:translate-x-0 ${
          collapsed ? '-translate-x-full md:w-19' : 'translate-x-0'
        }`}
      >
        {/* Sidebar Header */}
        <div className="flex h-16 items-center justify-between px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <span className="text-sm font-semibold">A</span>
              </div>

              <span className="text-sm font-semibold">Alpha AI</span>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            className="hidden size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground md:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* New Chat */}
        <div className="px-4">
          <button
            type="button"
            onClick={() => {
              onNewChat();
              router.push('/chat/new');
            }}
            className="flex h-10 w-full items-center gap-3 rounded-xl bg-foreground px-3 text-sm font-medium text-background transition-colors hover:bg-body-strong"
          >
            <Plus size={17} />

            {!collapsed && <span>New chat</span>}
          </button>
        </div>

        {/* Chat History */}
        <nav
          className="chat-sidebar-scrollbar mt-7 flex-1 overflow-y-auto px-3 pb-4"
          aria-label="Chat history"
        >
          {!collapsed && (
            <>
              <div className="mb-3 flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                <Clock3 size={13} />

                <span>Recent chats</span>
              </div>

              {chatGroups.map((group) => (
                <div key={group.label} className="mb-6">
                  <p className="mb-1 px-3 text-xs font-medium text-muted-foreground/80">
                    {group.label}
                  </p>

                  <div className="space-y-0.5">
                    {group.chats.map((chat: ChatItem) => {
                      const isActive = chat.id === activeChatId;

                      return (
                        <Link
                          href={`/chat/${chat.id}`}
                          key={chat.id}
                          aria-current={isActive ? 'page' : undefined}
                          className={`group/chat relative flex w-full items-center gap-3 overflow-hidden rounded-lg px-3 py-2.5 pl-4 text-left text-[13px] transition-all duration-150 ${
                            isActive
                              ? 'bg-primary/10 text-primary'
                              : 'text-muted-foreground hover:bg-sidebar-accent hover:text-foreground'
                          }`}
                        >
                          {/* Active chat indicator */}
                          <span
                            className={`absolute left-0 top-1/2 h-5 w-0.75 -translate-y-1/2 rounded-r-full bg-primary transition-all duration-150 ${
                              isActive ? 'opacity-100' : 'opacity-0'
                            }`}
                            aria-hidden="true"
                          />

                          <MessageSquare
                            size={15}
                            className={`shrink-0 transition-colors ${
                              isActive
                                ? 'text-primary'
                                : 'text-muted-foreground group-hover/chat:text-foreground'
                            }`}
                          />

                          <span
                            className={`min-w-0 flex-1 truncate ${isActive ? 'font-medium' : ''}`}
                          >
                            {chat.title}
                          </span>

                          {isActive && (
                            <MoreHorizontal
                              size={15}
                              className="ml-auto shrink-0 text-primary/70"
                            />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </>
          )}

          {collapsed && (
            <div className="flex flex-col items-center gap-3 pt-1">
              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-lg bg-sidebar-accent text-foreground"
                aria-label="Recent chats"
              >
                <Clock3 size={17} />
              </button>

              <button
                type="button"
                className="flex size-10 items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent"
                aria-label="Archive"
              >
                <Archive size={17} />
              </button>
            </div>
          )}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-3">
          <div className="mb-1 flex items-center justify-center gap-1">
            <ThemeToggle compact={collapsed} className={collapsed ? undefined : 'flex-1'} />
          </div>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left hover:bg-sidebar-accent"
          >
            <span className="flex size-9 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
              AM
            </span>

            {!collapsed && (
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">Alex Morgan</span>

                <span className="block truncate text-xs text-muted-foreground">Free plan</span>
              </span>
            )}

            {!collapsed && <Settings size={16} className="text-muted-foreground" />}
          </button>
        </div>

        {/* Mobile close button */}
        <button
          type="button"
          onClick={onToggle}
          className="absolute -right-3.75 top-5 z-10 flex size-8 items-center justify-center rounded-full border border-border bg-background text-muted-foreground shadow-sm md:hidden"
          aria-label="Close sidebar"
        >
          <ChevronLeft size={16} />
        </button>
      </aside>
    </>
  );
}
