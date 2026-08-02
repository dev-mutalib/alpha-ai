<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# AI Chatbot Application Guidelines & Conventions

## 1. Project Overview & Tech Stack

- **Project Name** : Alpha AI
- **Framework**: Next.js 16 (App Router)
- **Library**: React 19 (`react`, `react-dom`)
- **Language**: TypeScript (Strict mode enabled)
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`)

## 2. Core Architectural & File Structure Rules

- `app/`: App Router pages, layouts, and API routes (`app/api/chat/route.ts`).
- `components/`: Modular, reusable UI components.
  - `components/ui/`: Primitive components (Buttons, Inputs, Modals, Tooltips).
  - `components/chat/`: Chat-specific components (ChatInput, ChatMessage, MessageList, ModelSelector, CodeBlock, ActionButtons).
  - `components/sidebar/`: Navigation, chat history sidebar, settings drawer.
- `lib/`: Shared utilities, AI provider configurations, type definitions, and database adapters.
  - `lib/ai/`: Provider setups (OpenAI, Gemini, Anthropic, Ollama, etc.) and system prompts.
  - `lib/types/`: Centralized TypeScript interfaces and types (`chat.ts`, `models.ts`).
  - `lib/utils.ts`: Classnames merger (`clsx`, `tailwind-merge`) and helper functions.
- `hooks/`: Custom React hooks (`useChatScroll`, `useAutoResizeTextArea`, `useCopyToClipboard`).

## 3. Coding Conventions & Best Practices

### React 19 & Next.js 16 Standards

- **Server vs Client Components**:
  - Default to **Server Components** for page structures, static metadata, and initial data fetching.
  - Mark files with `'use client'` strictly when using state (`useState`, `useReducer`), effects (`useEffect`), browser APIs, or interactive event listeners.
- **TypeScript**:
  - Strictly typed props interfaces for all components.
  - Avoid `any`; use `unknown` or explicit generic types where necessary.
- **State & Streaming**:
  - Implement real-time response streaming for chat answers (ReadableStream / Server-Sent Events / AI SDK).
  - Use **Optimistic UI Updates** to instantly display user messages before server acknowledgement.
  - Keep message history state clean and serializable.

### UI & UX Aesthetics (Chatbot Specific)

- *First check if there's an `DESIGN.md` file, If there is then Follow that file for UI & UX Aesthetics. If not then Follow the rule's below*
- **Modern Dark & Light Mode**: Seamless dark/light theme support with sleek glassmorphism and modern color palettes.
- **Rich Markdown & Syntax Highlighting**:
  - Render bot responses in rich Markdown (bold, lists, tables, code blocks).
  - Include language badges, syntax highlighting, and a 1-click "Copy Code" button on code blocks.
- **Chat Experience**:
  - **Input Box**: Auto-resizing textarea, `Enter` to submit, `Shift + Enter` for multi-line break, stop generating button during active stream.
  - **Auto-scroll Logic**: Automatically scroll to the bottom when new tokens stream in; pause auto-scroll if user scrolls up manually.
  - **Action Controls**: Allow regenerating responses, copying message text, editing past prompts, and branching conversations.

## 4. Security & Performance Rules

- **API Key Protection**: Never expose API keys or AI model secrets on the client side. All AI service calls must pass through Server Actions or API Route Handlers (`app/api/chat/route.ts`).
- **Rate Limiting & Input Validation**: Sanitize inputs and validate prompt lengths to prevent API abuse.
- **Performance**: Lazy load heavy code syntax highlighters and markdown renderers to minimize main bundle size.

## 5. Agent Workflow Rules

- Check `AGENTS.md` and read `node_modules/next/dist/docs/` before making major changes to App Router logic.
- Run `npm run lint` and `npm run dev` / `npm run build` verification steps before finalizing updates.
