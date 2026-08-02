export default function ChatPage() {
  return (
    <div className="flex flex-col h-full w-full">
      {/* Scrollable Message List */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {/* Placeholder for messages */}
        <div className="text-center text-muted-foreground mt-10">Start a conversation...</div>
      </div>

      {/* Input Bar Placeholder */}
      <section className="p-4 shrink-0 bg-background border-t border-border">
        <div className="max-w-3xl mx-auto flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 bg-canvas border border-border rounded-md px-4 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary-active transition-colors">
            Send
          </button>
        </div>
      </section>
    </div>
  );
}
