export interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: number;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

export interface AppState {
  sessions: ChatSession[];
  activeChatId: string | null;
}