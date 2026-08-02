'use client';

import { useEffect, useRef } from 'react';
import { ArrowUp, Mic, Paperclip } from 'lucide-react';

export interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

export function ChatInput({ value, onChange, onSubmit }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  useEffect(() => { const textarea = textareaRef.current; if (!textarea) return; textarea.style.height = 'auto'; textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`; }, [value]);
  return (
    <section className="shrink-0 bg-gradient-to-t from-background via-background to-transparent px-4 pb-5 pt-4 sm:px-7 sm:pb-7">
      <form onSubmit={(event) => { event.preventDefault(); if (value.trim()) onSubmit(); }} className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-2 shadow-[0_8px_30px_rgba(20,20,19,0.08)]">
        <textarea ref={textareaRef} value={value} onChange={(event) => onChange(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter' && !event.shiftKey) { event.preventDefault(); if (value.trim()) onSubmit(); } }} rows={1} placeholder="Message Alpha AI..." className="max-h-40 min-h-11 w-full resize-none bg-transparent px-3 py-2.5 text-sm leading-6 text-foreground outline-none placeholder:text-muted-foreground" aria-label="Message Alpha AI" />
        <div className="flex items-center justify-between px-1 pt-1"><div className="flex items-center gap-1"><button type="button" disabled className="flex size-9 items-center justify-center rounded-lg text-muted-foreground/50" aria-label="Attach a file"><Paperclip size={17} /></button><button type="button" disabled className="flex size-9 items-center justify-center rounded-lg text-muted-foreground/50" aria-label="Use microphone"><Mic size={17} /></button><span className="ml-2 hidden text-[11px] text-muted-foreground sm:inline">Shift + Enter for new line</span></div><button type="submit" disabled={!value.trim()} className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-primary-disabled disabled:text-muted-foreground" aria-label="Send message"><ArrowUp size={17} /></button></div>
      </form><p className="mx-auto mt-3 max-w-3xl text-center text-[10px] text-muted-foreground/70">Alpha AI can make mistakes. Check important information.</p>
    </section>
  );
}
