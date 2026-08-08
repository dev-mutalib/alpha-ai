'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/chat/sidebar';
import { Topbar } from '@/components/chat/topbar';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [chatKey, setChatKey] = useState(0);

  return (
    <div className="flex h-full w-full">
      <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((value) => !value)} onNewChat={() => setChatKey((k) => k + 1)} />
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar onSidebarToggle={() => setSidebarCollapsed((value) => !value)} />
        <main key={chatKey} className="relative flex min-h-0 flex-1 flex-col overflow-hidden bg-background">{children}</main>
      </div>
    </div>
  );
}
