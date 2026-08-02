'use client';

import { ArrowUpRight, FileText, Lightbulb, PenLine, Search } from 'lucide-react';
import { ChatMessage, MessageList } from './message';

const suggestions = [
  { icon: PenLine, title: 'Write something', text: 'Draft, rewrite, or brainstorm an idea' },
  { icon: Lightbulb, title: 'Think it through', text: 'Explore a problem from a new angle' },
  { icon: Search, title: 'Learn something', text: 'Get a clear explanation of any topic' },
  { icon: FileText, title: 'Work with files', text: 'Summarize or pull insights from a file' },
];

export interface ChatWindowProps {
  messages: ChatMessage[];
  onSuggestion: (text: string) => void;
}

export function ChatWindow({ messages, onSuggestion }: ChatWindowProps) {
  return (
    <div className="min-h-0 flex-1 overflow-y-auto [scrollbar-gutter:stable] [scrollbar-color:#d6cec4_transparent] [scrollbar-width:thin]">
      {messages.length ? <MessageList messages={messages} /> : (
        <div className="mx-auto flex min-h-full w-full max-w-3xl flex-col justify-center px-5 pb-20 pt-8 sm:px-8">
          <div className="mb-8 text-center"><div className="mx-auto mb-5 flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm"><ArrowUpRight size={22} /></div><h1 className="font-heading text-3xl tracking-[-0.04em] text-foreground sm:text-4xl">How can I help you today?</h1><p className="mt-3 text-sm text-muted-foreground">Start with a thought, a question, or a little bit of context.</p></div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{suggestions.map(({ icon: Icon, title, text }) => <button key={title} type="button" onClick={() => onSuggestion(text)} className="group flex items-start gap-4 rounded-2xl border border-border bg-card/60 p-4 text-left transition-colors hover:bg-card"><span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-background text-primary"><Icon size={17} /></span><span><span className="block text-sm font-medium text-foreground">{title}</span><span className="mt-1 block text-xs leading-5 text-muted-foreground">{text}</span></span><ArrowUpRight size={15} className="ml-auto text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" /></button>)}</div>
        </div>
      )}
    </div>
  );
}
