import { Check, Copy, Sparkles } from 'lucide-react';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  time: string;
};

export const mockMessages: ChatMessage[] = [
  { id: '1', role: 'user', content: 'I’m putting together a launch plan for our new workspace product. Can you help me shape the story?', time: '10:42 AM' },
  { id: '2', role: 'assistant', content: 'Absolutely. A strong launch story usually has three beats: the friction people feel today, the new possibility your product creates, and a clear moment that shows it in action.\n\nTell me a little about the workspace and who you’re building it for, and we can turn that into a crisp narrative.', time: '10:42 AM' },
  { id: '3', role: 'user', content: 'It brings docs, tasks, and team decisions into one calm place. We’re starting with small product teams who are tired of scattered tools.', time: '10:44 AM' },
  { id: '4', role: 'assistant', content: 'That’s a compelling starting point. The emotional center is not “another tool” — it’s a quieter way for a team to stay aligned.\n\nHere’s a first pass at the positioning:\n\n**When your team’s thinking lives in too many places, progress starts to feel like archaeology.** Alpha gives product teams one shared space for the work, the context, and the decisions that move it forward.\n\nFrom there, your launch can move from the scattered-work problem into a short product moment: show a decision being made, a task becoming clear, and the whole team seeing the same picture.', time: '10:45 AM' },
];

function Message({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  return (
    <article className={`flex gap-3 ${isUser ? 'justify-end' : 'items-start'}`}>
      {!isUser && <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground"><Sparkles size={15} /></span>}
      <div className={`max-w-[min(680px,86%)] ${isUser ? 'items-end' : 'items-start'}`}>
        <div className={`whitespace-pre-line text-[15px] leading-7 ${isUser ? 'rounded-2xl rounded-tr-sm bg-foreground px-4 py-3 text-background' : 'text-body'}`}>{message.content}</div>
        <div className={`mt-2 flex items-center gap-2 text-[11px] text-muted-foreground ${isUser ? 'justify-end' : ''}`}>
          <span>{message.time}</span>
          {isUser ? <Check size={13} className="text-accent-teal" /> : <button type="button" className="opacity-0 transition-opacity group-hover:opacity-100 hover:text-foreground" aria-label="Copy message"><Copy size={13} /></button>}
        </div>
      </div>
    </article>
  );
}

export interface MessageListProps {
  messages: ChatMessage[];
}

export function MessageList({ messages }: MessageListProps) {
  return <div className="group mx-auto flex w-full max-w-3xl flex-col gap-8 px-5 py-8 sm:px-8 sm:py-10">{messages.map((message) => <Message key={message.id} message={message} />)}</div>;
}
