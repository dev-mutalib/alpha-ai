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
  Sparkles,
} from 'lucide-react';
import { ThemeToggle } from '@/components/theme-toggle';
import { useEffect, useState } from 'react';
import { getUserChats } from '@/app/actions/chat';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { isToday, isYesterday, isThisWeek } from 'date-fns';

type ChatItem = { id: string; title: string; updatedAt: Date | null };
type ChatGroup = { label: string; chats: ChatItem[] };

const groupChats = (chats: ChatItem[]): ChatGroup[] => {
  const groups: ChatGroup[] = [];
  const today = chats.filter(c => c.updatedAt && isToday(new Date(c.updatedAt)));
  const yesterday = chats.filter(c => c.updatedAt && isYesterday(new Date(c.updatedAt)));
  const thisWeek = chats.filter(c => c.updatedAt && isThisWeek(new Date(c.updatedAt)) && !isToday(new Date(c.updatedAt)) && !isYesterday(new Date(c.updatedAt)));
  const older = chats.filter(c => !c.updatedAt || (!isThisWeek(new Date(c.updatedAt)) && !isYesterday(new Date(c.updatedAt)) && !isToday(new Date(c.updatedAt))));
  
  if (today.length) groups.push({ label: 'Today', chats: today });
  if (yesterday.length) groups.push({ label: 'Yesterday', chats: yesterday });
  if (thisWeek.length) groups.push({ label: 'This Week', chats: thisWeek });
  if (older.length) groups.push({ label: 'Older', chats: older });
  
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
  const router = useRouter();

  useEffect(() => {
    getUserChats().then(data => {
      setChats(data.map(c => ({ id: c.id, title: c.title, updatedAt: c.updatedAt })));
    }).catch(console.error);
  }, [currentChatId]); // Refetch when chat id changes (i.e. a new chat is created)

  const chatGroups = groupChats(chats);

  return (
    <>
      {!collapsed && (
        <div
          aria-hidden="true"
          className="fixed inset-0 z-30 bg-foreground/20 backdrop-blur-[2px] md:hidden"
        />
      )}
      <aside
        className={`group/sidebar fixed inset-y-0 left-0 z-40 flex w-71 shrink-0 flex-col border-r border-border bg-sidebar transition-transform duration-300 ease-out md:relative md:z-auto md:translate-x-0 ${collapsed ? '-translate-x-full md:w-19' : 'translate-x-0'}`}
      >
        <div className="flex h-19 items-center justify-between px-5">
          <button
            type="button"
            onClick={onNewChat}
            className="flex items-center gap-3 text-left"
            aria-label="Start a new chat"
          >
            <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles size={17} strokeWidth={2.2} />
            </span>
            {!collapsed && (
              <span className="font-heading text-[19px] font-medium tracking-[-0.02em] text-foreground">
                Alpha AI
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onToggle}
            className="hidden size-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-foreground md:flex"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

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

        <nav className="mt-7 flex-1 overflow-y-auto px-3 pb-4" aria-label="Chat history">
          {!collapsed && (
            <>
              <div className="mb-3 flex items-center gap-2 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                <Clock3 size={13} />
                Recent chats
              </div>
              {chatGroups.map((group) => (
                <div key={group.label} className="mb-6">
                  <p className="mb-1 px-3 text-xs font-medium text-muted-foreground/80">
                    {group.label}
                  </p>
                  <div className="space-y-0.5">
                    {group.chats.map((chat: ChatItem, index: number) => (
                      <Link
                        href={`/chat/${chat.id}`}
                        key={chat.id}
                        className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-[13px] transition-colors hover:bg-sidebar-accent ${chat.id === currentChatId ? 'bg-sidebar-accent text-foreground' : 'text-muted-foreground'}`}
                      >
                        <MessageSquare size={15} className="shrink-0" />
                        <span className="truncate">{chat.title}</span>
                        {chat.id === currentChatId && (
                          <MoreHorizontal size={15} className="ml-auto shrink-0" />
                        )}
                      </Link>
                    ))}
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
