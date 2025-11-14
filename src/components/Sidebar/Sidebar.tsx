import React from 'react';
import { X, Plus, MessageCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ChatSession } from '../../types';
import SessionItem from './ChatItem';

interface SidebarProps {
  sessions: ChatSession[];
  activeChatId: string | null;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  onDeleteSession: (sessionId: string) => void;
  onRenameSession: (sessionId: string, newTitle: string) => void;
  onDownloadSession: (session: ChatSession) => void;
  isOpen: boolean;
  onClose: () => void;
  onToggleCollapse?: () => void;
  isCollapsed?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  activeChatId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  onRenameSession,
  onDownloadSession,
  isOpen,
  onClose,
  onToggleCollapse,
  isCollapsed = false,
}) => {

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 backdrop-blur-[2px] z-40 lg:hidden"
          onClick={onClose}
        />
      )}
      <div
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isCollapsed ? 'w-16 lg:w-16' : 'w-80'}
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700
          shadow-xl lg:shadow-none
          transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
          overflow-hidden
        `}
      >
        {!isCollapsed ? (
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-linear-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2 flex-1">
                <h2 className="text-3xl font-bold bg-linear-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  AI Chat
                </h2>
              </div>

              <div className="flex items-center space-x-2">
                {onToggleCollapse && (
                  <button
                    onClick={onToggleCollapse}
                    className="hidden lg:flex p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 dark:hover:bg-gray-700/50 transition-all"
                    aria-label="Collapse sidebar"
                    title="Collapse sidebar"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                )}

                <button
                  onClick={onClose}
                  className="lg:hidden p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-white/50 transition-all"
                  aria-label="Close sidebar"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <button
              onClick={onNewChat}
              className="w-full px-4 py-3 bg-linear-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-xl transition-all duration-200 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="w-5 h-5" />
              <span className="font-semibold">New Chat</span>
            </button>
          </div>
        ) : (
          <div className="p-2 dark:border-gray-700">
            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="w-full p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                aria-label="Expand sidebar"
                title="Expand sidebar"
              >
                <ChevronLeft className="w-5 h-5 mx-auto" />
              </button>
            )}
          </div>
        )}

        {!isCollapsed && (
          <>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {sessions.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 mt-8 p-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium">No chat sessions yet</p>
                  <p className="text-xs mt-2">Click "New Chat" to start!</p>
                </div>
              ) : (
                sessions.map((session) => (
                  <SessionItem
                    key={session.id}
                    session={session}
                    isActive={session.id === activeChatId}
                    onSelect={() => onSelectSession(session.id)}
                    onDelete={() => onDeleteSession(session.id)}
                    onRename={onRenameSession}
                    onDownload={onDownloadSession}
                  />
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default Sidebar;