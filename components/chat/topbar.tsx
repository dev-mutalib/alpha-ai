'use client';

import { ChevronDown, Menu, SlidersHorizontal } from 'lucide-react';

export interface TopbarProps {
  onSidebarToggle: () => void;
}

export function Topbar({ onSidebarToggle }: TopbarProps) {
  return (
    <header className="flex h-[76px] shrink-0 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-7">
      <div className="flex min-w-0 items-center gap-3">
        <button type="button" onClick={onSidebarToggle} className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Toggle sidebar"><Menu size={19} /></button>
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-foreground">Product launch notes</p>
          <p className="mt-0.5 hidden text-xs text-muted-foreground sm:block">Today, 10:42 AM</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-full border border-border bg-card/60 px-3 py-1.5 text-xs font-medium text-muted-foreground sm:flex"><span className="size-1.5 rounded-full bg-accent-teal" /> Alpha Standard <ChevronDown size={13} /></div>
        <button type="button" className="flex size-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Conversation settings"><SlidersHorizontal size={17} /></button>
      </div>
    </header>
  );
}
