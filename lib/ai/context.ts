import type { Memory } from '@/types/memory';

export function buildMemoryContext(memories: Memory[]): string {
  if (memories.length === 0) {
    return '';
  }

  const memoryLines = memories.map((memory) => `- ${memory.content}`).join('\n');

  return `
## User Memory

The following information was explicitly remembered
from previous conversations.

Use these memories only when they are relevant to
the user's current request.

${memoryLines}
`.trim();
}
