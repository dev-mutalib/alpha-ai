export default function ChatLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full w-full">
      {/* Sidebar - Collapsible Structure Placeholder */}
      <aside className="w-64 border-r border-border bg-card flex flex-col shrink-0 md:flex">
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-muted-foreground font-medium mb-4">Chat History</div>
          {/* History items will go here */}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Topbar Placeholder */}
        <header className="h-14 border-b border-border flex items-center justify-between px-4 shrink-0 bg-background">
          <div className="font-semibold">Alpha AI</div>
          <div className="text-sm text-muted-foreground">Sign In</div>
        </header>

        {/* Chat Container */}
        <main className="flex-1 overflow-hidden min-h-0 bg-background relative flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}
