import { Sparkles } from 'lucide-react';

export function TypingIndicator() {
  return (
    <div className="flex items-start gap-3" aria-label="Assistant is thinking">
      <span className="flex size-8 shrink-0 items-center justify-center rounded-[10px] bg-primary text-primary-foreground">
        <Sparkles size={15} />
      </span>
      <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm border border-border bg-card px-4 py-3">
        {[0, 1, 2].map((dot) => (
          <span
            key={dot}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground"
            style={{ animationDelay: `${dot * 140}ms` }}
          />
        ))}
      </div>
    </div>
  );
}
