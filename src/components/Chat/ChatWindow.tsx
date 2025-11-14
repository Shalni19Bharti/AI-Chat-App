import React from 'react';
import { Menu, MessageCircle, Zap } from 'lucide-react';
import type { ChatSession } from '../../types';
import MessageList from './MessageList';
import MessageInput from './MessageInput';

interface ChatWindowProps {
  session: ChatSession | undefined;
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  onToggleSidebar: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  session,
  isLoading,
  onSendMessage,
  onToggleSidebar,
}) => {
  if (!session) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="p-4">
          <div className="flex items-center max-w-4xl mx-auto">
            <button
              onClick={onToggleSidebar}
              className="lg:hidden mr-3 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
              aria-label="Toggle sidebar"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">AI Chat</h1>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center max-w-md">
            <div className="mb-6 relative">
              <div className="w-24 h-24 mx-auto bg-linear-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-3xl flex items-center justify-center">
                <MessageCircle
                  className="w-12 h-12 text-blue-500 dark:text-blue-400"
                />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              Welcome to AI Chat
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              Create a new chat session to start having intelligent conversations with AI. Get answers, brainstorm ideas, or just chat!
            </p>
            <div className="inline-flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-4 py-2 rounded-full">
              <Zap className="w-4 h-4" />
              <span>Powered by Google Gemini AI</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen">
      <div className="p-4 shrink-0">
        <div className="flex items-center max-w-4xl">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden mr-3 p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            aria-label="Toggle sidebar"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-semibold text-gray-900 dark:text-white text-left pl-8 pt-4">AI Chat</h1>
        </div>
      </div>

      <MessageList messages={session.messages} isLoading={isLoading} />

      <MessageInput onSendMessage={onSendMessage} disabled={isLoading} />
    </div>
  );
};

export default ChatWindow;