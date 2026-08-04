# Alpha AI - Project Summary

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technical Stack](#technical-stack)
3. [Project Structure](#project-structure)
4. [Core Features](#core-features)
5. [Architecture](#architecture)
6. [Design System](#design-system)
7. [AI Integration](#ai-integration)
8. [Environment Configuration](#environment-configuration)
9. [Recent Changes](#recent-changes)
10. [Key Files](#key-files)
11. [Development Workflow](#development-workflow)

---

## Project Overview

**Alpha AI** is a modern, feature-rich AI chat application built with Next.js 16 and React 19. The application provides a sophisticated chat interface with support for multiple AI providers, including GROQ, Google Generative AI, OpenAI, and Anthropic.

### Project Details
- **Name**: Alpha AI
- **Version**: 0.1.0
- **Type**: Private application
- **Description**: A modern AI chat application with advanced features
- **Repository Status**: Development branch active

---

## Technical Stack

### Frontend Framework
- **Next.js**: 16.2.12 (App Router)
- **React**: 19.2.4
- **TypeScript**: Strict mode enabled
- **Styling**: Tailwind CSS v4 with custom theme

### UI & Design
- **ShadCN UI**: Component library with Radix UI primitives
- **Tailwind Merge**: Utility class merging
- **Lucide React**: Icon library
- **Next Themes**: Dark/light mode support
- **Custom Design System**: Based on Anthropic's warm cream canvas design

### AI & Data
- **AI SDK**: `@ai-sdk/react`, `@ai-sdk/groq`, `@ai-sdk/google`, `@ai-sdk/openai`, `@ai-sdk/anthropic`
- **Database**: Better SQLite3 with Drizzle ORM
- **Authentication**: Better Auth, Next Auth
- **State Management**: Zustand
- **Validation**: Zod schema validation

### Additional Libraries
- **Form Handling**: React Hook Form with Zod resolvers
- **Markdown Processing**: React Markdown, Rehype Highlight, Rehype Sanitize
- **Syntax Highlighting**: Highlight.js, js-tiktoken
- **Utilities**: clsx, tailwind-merge, nanoid, uuid
- **Animation**: tw-animate-css
- **File Uploads**: UploadThing
- **Notifications**: Sonner
- **Date Handling**: date-fns
- **API Clients**: Axios

### Dev Dependencies
- **ESLint**: Configuration with Next.js and TypeScript support
- **Prettier**: Code formatting
- **Commitlint**: Conventional commit standards
- **Husky**: Git hooks
- **Lint Staged**: Pre-commit linting
- **TypeScript ESLint**: Additional TypeScript linting

---

## Project Structure

```
alpha/
├── app/                          # Next.js App Router
│   ├── (chat)/                   # Chat group layout
│   │   ├── layout.tsx            # Chat layout component
│   │   └── page.tsx              # Main chat page
│   ├── api/                      # API routes
│   │   └── chat/                 # Chat API endpoint
│   │       └── route.ts          # Chat POST handler
│   ├── favicon.ico               # Application favicon
│   ├── globals.css               # Global styles and CSS variables
│   └── layout.tsx                # Root layout component
│
├── components/                   # React components
│   ├── chat/                     # Chat-specific components
│   │   ├── chat-input.tsx        # User input component with auto-resize
│   │   ├── chat-window.tsx       # Main chat display area
│   │   ├── message.tsx           # Individual message component
│   │   ├── sidebar.tsx           # Chat history sidebar
│   │   ├── topbar.tsx            # Top navigation bar
│   │   └── typing-indicator.tsx  # Loading indicator
│   ├── theme-provider.tsx        # Theme context provider
│   ├── theme-toggle.tsx          # Dark/light mode toggle
│   └── ui/                      # UI primitives (ShadCN)
│       └── button.tsx            # Base button component
│
├── lib/                         # Library and utilities
│   ├── ai/                      # AI provider configurations
│   │   └── providers/            # Individual provider setups
│   │       ├── groq.ts          # GROQ AI provider
│   │       └── openai.ts        # OpenAI provider
│   ├── env.ts                   # Environment variable validation
│   └── utils.ts                 # Utility functions (cn, etc.)
│
├── types/                       # TypeScript type definitions
├── public/                      # Public assets
├── node_modules/                # Dependencies
│
# Configuration Files
├── package.json                 # Project dependencies and scripts
├── package-lock.json            # Dependency lock file
├── bun.lock                     # Bun package lock
├── tsconfig.json                # TypeScript configuration
├── tailwind.config.mjs          # Tailwind CSS configuration
├── postcss.config.mjs           # PostCSS configuration
├── next.config.ts               # Next.js configuration
├── eslint.config.mjs            # ESLint configuration
├── prettierrc                   # Prettier configuration
├── .env                         # Environment variables
├── .gitignore                   # Git ignore patterns
│
# Documentation
├── README.md                    # Basic project setup
├── DESIGN.md                    # Comprehensive design system
├── AGENTS.md                    # AI agent rules and conventions
├── AG.md                        # Additional guidelines
└── CLAUDE.md                    # Claude-specific notes
```

---

## Core Features

### 1. Chat Interface
- **Real-time Streaming**: Messages stream in real-time using AI SDK
- **Auto-resizing Input**: Textarea automatically adjusts to content
- **Markdown Support**: Rich text formatting with React Markdown
- **Code Syntax Highlighting**: Integrated syntax highlighting for code blocks
- **Suggestion Prompts**: Pre-defined conversation starters
- **Typing Indicators**: Visual feedback during AI response generation

### 2. User Experience
- **Dark/Light Mode**: Toggle between themes with Next Themes
- **Responsive Design**: Fully responsive layout for all screen sizes
- **Chat History**: Persistent conversation history in sidebar
- **Message Actions**: Copy, regenerate, and other message interactions
- **Auto-scroll**: Automatic scrolling to new messages with manual override

### 3. AI Capabilities
- **Multi-provider Support**: GROQ, Google, OpenAI, Anthropic
- **Model Selection**: Choose from various AI models
- **System Prompts**: Customizable AI personality and behavior
- **Error Handling**: Graceful error handling and user feedback
- **Rate Limiting**: Protection against API abuse

### 4. Technical Features
- **Type Safety**: Full TypeScript support with strict mode
- **Form Validation**: Zod schema validation for all inputs
- **Environment Validation**: Runtime environment variable checking
- **Optimistic UI**: Instant feedback for user actions

---

## Architecture

### Component Hierarchy

```
Root Layout (app/layout.tsx)
└── Theme Provider
    └── App Router Children
        ├── Chat Layout (app/(chat)/layout.tsx)
        │   ├── Sidebar (components/chat/sidebar.tsx)
        │   ├── Topbar (components/chat/topbar.tsx)
        │   └── Chat Page (app/(chat)/page.tsx)
        │       ├── Chat Window (components/chat/chat-window.tsx)
        │       │   └── Message List (components/chat/message.tsx)
        │       ├── Chat Input (components/chat/chat-input.tsx)
        │       └── Typing Indicator (components/chat/typing-indicator.tsx)
        └── API Routes (app/api/chat/route.ts)
```

### Data Flow

1. **User Input**: ChatInput component captures user messages
2. **State Management**: useChat hook from AI SDK manages conversation state
3. **API Request**: Messages sent to `/api/chat` endpoint
4. **AI Processing**: Route handler processes messages with selected AI provider
5. **Streaming Response**: AI responses streamed back to client in real-time
6. **UI Update**: Messages rendered in ChatWindow with Message components

### State Management
- **Client State**: React useState, useMemo hooks
- **AI State**: `@ai-sdk/react` useChat hook for conversation management
- **Global State**: Zustand for cross-component state
- **Theme State**: Next Themes for dark/light mode persistence

---

## Design System

### Color Palette

The design system uses OKLCH color space for better color consistency:

**Light Theme:**
- Background: `oklch(0.985 0.008 85)` - Warm cream canvas
- Foreground: `oklch(0.185 0.008 85)` - Dark ink
- Primary: `oklch(0.62 0.105 37)` - Warm coral (#cc785c equivalent)
- Card: `oklch(0.94 0.025 80)` - Light cream surface
- Accent Teal: `oklch(0.69 0.09 172)` - Secondary accent

**Dark Theme:**
- Background: `oklch(0.17 0.008 85)` - Dark navy
- Foreground: `oklch(0.975 0.008 85)` - Cream text
- Primary: `oklch(0.7 0.105 37)` - Brighter coral for dark mode
- Card: `oklch(0.23 0.01 85)` - Dark surface cards

### Typography
- **Font Family**: Inter (humanist sans-serif) as primary body font
- **Display**: Copernicus / Tiempos Headline (serif) for headlines (defined in DESIGN.md)
- **Code**: JetBrains Mono for code blocks
- **Font Sizes**: Hierarchical system from 12px captions to 64px display

### Spacing
- Base unit: 4px
- Scale: xxs(4px), xs(8px), sm(12px), md(16px), lg(24px), xl(32px), xxl(48px), section(96px)

### Border Radius
- xs: 4px, sm: 6px, md: 8px, lg: 12px, xl: 16px, pill: 9999px, full: 50%

### Design Philosophy
- **Warm Canvas**: Cream background instead of cool white/blue
- **Color Blocking**: Depth through color contrast rather than shadows
- **Editorial Feel**: Literary magazine aesthetic with serif headlines
- **Minimal Shadows**: Rare use of box shadows, preference for color elevation
- **Brand Identity**: Coral (#cc785c) as signature accent color

---

## AI Integration

### Supported Providers

1. **GROQ** (Primary)
   - Model: `openai/gpt-oss-120b`
   - Configuration: `@ai-sdk/groq` with API key from environment
   - Usage: Default provider in chat route

2. **Google Generative AI**
   - Configuration: `@ai-sdk/google` with API key
   - Required: `GOOGLE_GENERATIVE_AI_API_KEY`

3. **OpenAI**
   - Configuration: `@ai-sdk/openai`
   - Required: `OPENAI_API_KEY`

4. **Anthropic**
   - Configuration: `@ai-sdk/anthropic`
   - Required: `ANTHROPIC_API_KEY`

### AI SDK Integration
- **useChat Hook**: Manages conversation state and streaming
- **convertToModelMessages**: Transforms UI messages to model-compatible format
- **streamText**: Generates streaming responses from AI models
- **toUIMessageStreamResponse**: Converts AI response to UI-compatible stream

### Current Configuration
The chat route (`app/api/chat/route.ts`) currently uses:
- **Provider**: GROQ
- **Model**: `openai/gpt-oss-120b`
- **System Prompt**: "You are Alpha AI. You are a helpful, knowledgeable and concise AI assistant. Always provide accurate, clear and well structured answers."
- **Max Retries**: 5

---

## Environment Configuration

### Required Variables
```env
GOOGLE_GENERATIVE_AI_API_KEY=* (Required)
```

### Optional Variables
```env
OPENAI_API_KEY=""
ANTHROPIC_API_KEY=""
GROQ_API_KEY=""
DATABASE_URL="sqlite://local.db"
NEXTAUTH_SECRET=""
NVIDIA_BASE_URL=""
NVIDIA_API_KEY=""
```

### Environment Validation
- Uses Zod schema validation (`lib/env.ts`)
- Runtime validation with descriptive error messages
- Graceful handling of missing optional variables

---

## Recent Changes

Based on git history, the most recent changes include:

1. **Provider Migration** (d03ebd4)
   - Changed primary provider from Google to GROQ
   - Updated API configuration in chat route

2. **GROQ Implementation** (b71e04d, 687f129, ece09f7, c2c359f)
   - Added GROQ provider setup (`lib/ai/providers/groq.ts`)
   - Added `@ai-sdk/groq` and `@ai-sdk/openai-compatible` dependencies
   - Integrated GROQ_API_KEY into environment schema

---

## Key Files

### Core Application Files
- **app/layout.tsx**: Root layout with theme provider
- **app/(chat)/page.tsx**: Main chat interface
- **app/api/chat/route.ts**: Chat API endpoint
- **components/chat/*.tsx**: Chat components
- **lib/ai/providers/*.ts**: AI provider configurations

### Configuration Files
- **package.json**: Dependencies and scripts
- **tsconfig.json**: TypeScript configuration
- **app/globals.css**: Global styles and CSS variables
- **lib/env.ts**: Environment validation

### Design Files
- **DESIGN.md**: Comprehensive design system documentation
- **components.json**: ShadCN configuration

---

## Development Workflow

### Scripts
```bash
# Development
bun dev          # Start development server
npm run dev      # Alternative with npm
pnpm dev        # Alternative with pnpm

# Build
bun build        # Build for production
npm run build    # Alternative with npm

# Lint
npm run lint     # Run ESLint
```

### Development Server
- **URL**: http://localhost:3000
- **Framework**: Next.js with fast refresh
- **Port**: 3000 (default)

### Git Workflow
- **Current Branch**: development
- **Main Branch**: main
- **Commit Style**: Conventional commits (enforced by commitlint)
- **Hooks**: Husky with lint-staged for pre-commit checks

### Code Quality
- **ESLint**: Strict TypeScript and Next.js rules
- **Prettier**: Opinionated code formatting
- **TypeScript**: Strict mode with no implicit any
- **Unused Imports**: Detected and flagged

---

## Dependencies Overview

### Production Dependencies (Key)
- **Next.js Ecosystem**: next, react, react-dom
- **AI Integration**: @ai-sdk/* packages, ai
- **Database**: better-sqlite3, drizzle-orm, ioredis, @upstash/*
- **UI**: @radix-ui/*, lucide-react, next-themes, shadcn
- **Authentication**: better-auth, next-auth
- **Utilities**: zod, uuid, nanoid, axios, clsx, tailwind-merge
- **Markdown**: react-markdown, rehype-*, remark-gfm
- **Syntax Highlighting**: highlight.js, js-tiktoken
- **State**: zustand
- **Animations**: tw-animate-css
- **Notifications**: sonner
- **File Uploads**: uploadthing
- **Telemetry**: @opentelemetry/*, @vercel/*

### Development Dependencies
- **Tooling**: eslint, prettier, typescript, @types/*
- **Git**: husky, lint-staged, commitlint
- **CSS**: tailwindcss, @tailwindcss/postcss
- **Build**: drizzle-kit

---

## Security Considerations

### API Key Protection
- All AI API keys stored in environment variables
- Server-side validation prevents client exposure
- API routes act as proxies to AI services
- No direct client-side AI service calls

### Input Validation
- Zod schemas validate all API request bodies
- Environment variables validated at runtime
- Type safety throughout the application

### Rate Limiting
- Upstash Redis integration for rate limiting
- API abuse protection configured

---

## Performance Optimizations

- **Streaming**: Real-time message streaming reduces perceived latency
- **Lazy Loading**: Heavy libraries loaded on-demand
- **Optimistic UI**: Instant feedback for user actions
- **Code Splitting**: Automatic with Next.js
- **Bundle Optimization**: Tailwind CSS purge unused styles

---

## Future Enhancements

Based on the current architecture, potential enhancements include:

1. **Additional AI Providers**: Expand beyond current 4 providers
2. **Conversation Persistence**: Database integration for chat history
3. **User Authentication**: Full auth system with session management
4. **Model Customization**: Allow users to select different models
5. **Advanced Features**: File uploads, image generation, tool usage
6. **Plugin System**: Extensible architecture for custom integrations
7. **Mobile App**: Potential React Native adaptation

---

## Conclusion

Alpha AI represents a sophisticated, modern AI chat application with a strong foundation in Next.js 16 and React 19. The project demonstrates:

- **Clean Architecture**: Well-organized component structure
- **Type Safety**: Comprehensive TypeScript implementation
- **Design Excellence**: Thoughtful, editorial design system
- **Multi-AI Support**: Flexible provider architecture
- **User Experience**: Intuitive interface with modern UX patterns
- **Scalability**: Architecture designed for growth and extension

The recent migration from Google to GROQ as the primary provider shows the project's adaptability and commitment to utilizing the most capable AI models available.

---

*Generated on: August 4, 2026*
*Project Version: 0.1.0*
*Next.js Version: 16.2.12*