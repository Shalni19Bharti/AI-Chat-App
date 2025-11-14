# AI Chat Application

A responsive AI chat application built with React, TypeScript, and Tailwind CSS that allows users to have conversations with AI (Google Gemini) and manage multiple chat sessions with persistent storage.

## Table of Contents

- [Features](#features)
- [Required Functionality](#required-functionality)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Usage Guide](#usage-guide)
- [API Integration](#api-integration)
- [Data Persistence](#data-persistence)
- [Design Decisions](#design-decisions)
- [Building for Production](#building-for-production)
- [Troubleshooting](#troubleshooting)

## Features

- 🤖 **AI-Powered Conversations**: Google Gemini API (gemini-2.5-flash model)
- 💬 **Multiple Chat Sessions**: Create, switch, rename, and delete sessions
- 💾 **Persistent Storage**: Auto-save to localStorage with restore on reload
- 📱 **Responsive Design**: Desktop (side-by-side) and mobile (hamburger menu)
- 📥 **Download Chat History**: Export sessions as JSON files
- ⌨️ **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line
- ⚡ **Typing Indicator**: Visual feedback while AI generates responses
- 🎯 **Auto-scrolling**: Automatically scrolls to latest message
- 📝 **Smart Titles**: Auto-generates chat titles from first message

## Required Functionality

### 1. React Components ✅

- **App.tsx**: Main application component managing state
- **Sidebar.tsx**: Chat sessions list with new chat button
- **ChatWindow.tsx**: Active conversation interface
- **MessageList.tsx**: Renders all messages in conversation
- **MessageItem.tsx**: Individual messages with user/AI distinction
- **MessageInput.tsx**: Input component with keyboard shortcuts

### 2. CSS Styling ✅

- **Tailwind CSS 4**: All styling with responsive design
- **Desktop**: Sidebar and chat window side-by-side
- **Mobile**: Hamburger menu toggle, full-width chat window
- **Message Styles**: Blue for user, white/gray for AI

### 3. State Management ✅

- **React Hooks**: `useState`, `useCallback`, `useEffect`
- **Custom Hooks**: `useChatSessions`, `useLocalStorage`
- **localStorage**: All sessions and messages persisted

### 4. API Integration ✅

- **Google Gemini API**: gemini-2.5-flash model
- **Context-Aware**: Full conversation history sent with requests
- **Loading States**: Typing indicator during API calls
- **Error Handling**: User-friendly error messages

### 5. Core Functionality ✅

- **Create/Switch Sessions**: New chat button, click to switch
- **Send/Receive Messages**: Full conversation flow
- **Download JSON**: Session ID, title, timestamps, all messages
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new line

### 6. Data Persistence ✅

- **Auto-save**: Sessions and messages saved to localStorage
- **Remember Active**: Last active session restored on reload
- **Complete Restore**: All data restored when app reopens

## Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Vite** - Build Tool
- **Tailwind CSS 4** - Styling
- **Google Gemini API** - AI Integration
- **LocalStorage** - Data Persistence

## Project Structure

```
src/
├── components/
│   ├── Chat/
│   │   ├── ChatWindow.tsx      # Main chat interface
│   │   ├── MessageList.tsx     # Message display container
│   │   ├── MessageItem.tsx     # Individual message component
│   │   └── MessageInput.tsx    # Message input with keyboard shortcuts
│   ├── Sidebar/
│   │   ├── Sidebar.tsx         # Session list sidebar
│   │   └── SessionItem.tsx     # Individual session item
│   └── common/
│       ├── LoadingIndicator.tsx # Typing indicator
│       └── DeleteConfirmationModal.tsx # Delete confirmation
├── hooks/
│   ├── useLocalStorage.ts      # Custom localStorage hook
│   └── useChatSessions.ts      # Chat session management
├── services/
│   └── geminiApi.ts            # Gemini API integration
├── types/
│   └── index.ts                # TypeScript type definitions
├── utils/
│   └── helpers.ts              # Utility functions
├── App.tsx                      # Main application component
├── main.tsx                     # Application entry point
└── index.css                    # Global styles
```

## Getting Started

### Prerequisites

- **Node.js** (v18+) - [Download](https://nodejs.org/)
- **npm** or **yarn**
- **Google Gemini API Key** - [Get Free Key](https://aistudio.google.com/app/apikey)

### Installation & Running

1. **Install dependencies**

```bash
npm install
```

2. **Set up environment variables**

Create `.env` file in root directory:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

3. **Start development server**

```bash
npm run dev
```

Application opens at `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage Guide

**Sessions**: Click "New Chat" to create, click session to switch. Hover session → three-dot menu (⋮) → Rename/Delete/Download.

**Messages**: Type in input, **Enter** to send, **Shift+Enter** for new line. Typing indicator shows during AI response.

**Mobile**: Tap hamburger menu (☰) to toggle sidebar. Tap outside or X to close. Full-width chat when sidebar closed.

## API Integration

**Google Gemini API**: Model `gemini-2.5-flash`. Configuration: Temperature 0.7, Max Tokens 2048, Top-K 40, Top-P 0.95. Safety settings enabled. Features: Full conversation context, retry logic with exponential backoff, error handling.

**Get API Key**: [Google AI Studio](https://aistudio.google.com/app/apikey) → Sign in → Create API key → Add to `.env` as `VITE_GEMINI_API_KEY`

## Data Persistence

All data stored in browser localStorage:

- **Storage Key**: `chatAppState`
- **Data Structure**:

```typescript
{
  sessions: ChatSession[],
  activeChatId: string | null
}
```

- **Auto-save**: All changes saved immediately to localStorage
- **Restore**: Sessions, messages, and active session restored on app reload

## Design Decisions

**Architecture**: Component-based with custom hooks (`useChatSessions`, `useLocalStorage`). No external state library. localStorage chosen over IndexedDB for simplicity.

**UI/UX**: Mobile-first responsive design (`lg` breakpoint 1024px). User messages right-aligned blue, AI messages left-aligned white/gray. Animated typing indicator with disabled input during API calls.

**Technical**: React 19 + TypeScript for type safety. Vite + Tailwind CSS 4 for fast builds. Feature-based structure. Performance optimizations with `useCallback` and auto-scrolling.

**Assumptions**: Modern browsers (ES6+, localStorage), stable internet, single-user app, Node.js v18+.

## Building for Production

```bash
npm run build
```

Built files in `dist` directory. Preview with `npm run preview`.

## License

MIT License - Open source project

## Acknowledgments

- Google Gemini API for AI capabilities
- Tailwind CSS for styling framework
- React team for the framework

---

Built with ❤️ using React + TypeScript + Vite + Tailwind CSS
