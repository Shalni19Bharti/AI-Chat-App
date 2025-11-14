import { useState, useCallback, useEffect } from 'react';
import Sidebar from './components/Sidebar/Sidebar';
import ChatWindow from './components/Chat/ChatWindow';
import DeleteConfirmationModal from './components/Chat/DeleteModal';
import { useChatSessions } from './hooks/useChat';
import { sendMessageToGemini } from './services/chatService';
import type { Message, ChatSession } from './types';
import { generateId, generateChatTitle, downloadJSON } from './utils/helpers';

function App() {
  const {
    sessions,
    activeSession,
    activeChatId,
    isLoading,
    setIsLoading,
    createNewSession,
    switchSession,
    addMessage,
    updateSessionTitle,
    deleteSession,
  } = useChatSessions();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [deleteModalState, setDeleteModalState] = useState<{
    isOpen: boolean;
    sessionId: string | null;
  }>({ isOpen: false, sessionId: null });

  useEffect(() => {
    if (sessions.length === 0) {
      createNewSession();
    }
  }, [createNewSession, sessions.length]);

  const handleNewChat = useCallback(() => {
    createNewSession();
    setIsSidebarOpen(false);
  }, [createNewSession]);

  const handleSelectSession = useCallback(
    (sessionId: string) => {
      switchSession(sessionId);
      setIsSidebarOpen(false);
    },
    [switchSession]
  );

  const handleDeleteRequest = useCallback((sessionId: string) => {
    if (isSidebarOpen) {
      setIsSidebarOpen(false);
      setTimeout(() => {
        setDeleteModalState({ isOpen: true, sessionId });
      }, 10);
    } else {
      setDeleteModalState({ isOpen: true, sessionId });
    }
  }, [isSidebarOpen]);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteModalState.sessionId) {
      if (sessions.length === 1) {
        createNewSession();
      }
      deleteSession(deleteModalState.sessionId);
      setDeleteModalState({ isOpen: false, sessionId: null });
    }
  }, [deleteModalState.sessionId, deleteSession, sessions.length, createNewSession]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteModalState({ isOpen: false, sessionId: null });
  }, []);

  const handleRenameSession = useCallback(
    (sessionId: string, newTitle: string) => {
      updateSessionTitle(sessionId, newTitle);
    },
    [updateSessionTitle]
  );

  const handleDownloadSession = useCallback((session: ChatSession) => {
    downloadJSON(session, `chat-${session.id}.json`);
  }, []);

  const handleSendMessage = useCallback(
    async (content: string) => {
      if (!activeChatId || isLoading) return;
      if (!activeSession) {
        return;
      }

      const isFirstMessage = activeSession.messages.length === 0;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content,
        timestamp: Date.now(),
      };

      addMessage(userMessage);

      setIsLoading(true);

      try {
        const allMessages = [...activeSession.messages, userMessage];

        const aiResponse = await sendMessageToGemini(allMessages);

        if (!aiResponse || typeof aiResponse !== 'string' || aiResponse.trim().length === 0) {
          throw new Error('AI returned an empty or invalid response');
        }

        const aiMessage: Message = {
          id: generateId(),
          role: 'ai',
          content: aiResponse,
          timestamp: Date.now(),
        };

        addMessage(aiMessage);

        if (isFirstMessage) {
          const title = generateChatTitle(content);
          updateSessionTitle(activeChatId, title);
        }
      } catch (error) {

        const errorMessage: Message = {
          id: generateId(),
          role: 'ai',
          content: `Sorry, I encountered an error: ${error instanceof Error ? error.message : 'Unknown error'}. Please make sure your API key is set correctly in the .env file.`,
          timestamp: Date.now(),
        };
        addMessage(errorMessage);

        if (isFirstMessage) {
          const title = generateChatTitle(content);
          updateSessionTitle(activeChatId, title);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [
      activeChatId,
      activeSession,
      isLoading,
      addMessage,
      updateSessionTitle,
      setIsLoading,
    ]
  );

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  const toggleSidebarCollapse = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  return (
    <div className="flex h-screen bg-linear-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <Sidebar
        sessions={sessions}
        activeChatId={activeChatId}
        onSelectSession={handleSelectSession}
        onNewChat={handleNewChat}
        onDeleteSession={handleDeleteRequest}
        onRenameSession={handleRenameSession}
        onDownloadSession={handleDownloadSession}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onToggleCollapse={toggleSidebarCollapse}
        isCollapsed={isSidebarCollapsed}
      />
      <ChatWindow
        session={activeSession}
        isLoading={isLoading}
        onSendMessage={handleSendMessage}
        onToggleSidebar={toggleSidebar}
      />
      <DeleteConfirmationModal
        isOpen={deleteModalState.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
      />
    </div>
  );
}

export default App;