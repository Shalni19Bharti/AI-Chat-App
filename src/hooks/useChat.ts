import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { ChatSession, Message, AppState } from '../types';
import { generateId } from '../utils/helpers';

export const useChatSessions = () => {
  const [appState, setAppState] = useLocalStorage<AppState>('chatAppState', {
    sessions: [],
    activeChatId: null,
  });

  const [isLoading, setIsLoading] = useState(false);

  const activeSession = appState.sessions.find(
    (session) => session.id === appState.activeChatId
  );

  const createNewSession = useCallback(() => {
    const newSession: ChatSession = {
      id: generateId(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setAppState((prev) => ({
      sessions: [newSession, ...prev.sessions],
      activeChatId: newSession.id,
    }));

    return newSession.id;
  }, [setAppState]);

  const switchSession = useCallback(
    (sessionId: string) => {
      setAppState((prev) => ({
        ...prev,
        activeChatId: sessionId,
      }));
    },
    [setAppState]
  );

  const addMessage = useCallback(
    (message: Message) => {
      setAppState((prev) => {
        if (!prev.activeChatId) {
          return prev;
        }
        
        const sessionIndex = prev.sessions.findIndex(s => s.id === prev.activeChatId);
        if (sessionIndex === -1) {
          return prev;
        }

        const updatedSessions = prev.sessions.map((session) =>
          session.id === prev.activeChatId
            ? {
                ...session,
                messages: [...session.messages, message],
                updatedAt: Date.now(),
              }
            : session
        );

        return {
          ...prev,
          sessions: updatedSessions,
        };
      });
    },
    [setAppState]
  );

  const updateSessionTitle = useCallback(
    (sessionId: string, title: string) => {
      setAppState((prev) => ({
        ...prev,
        sessions: prev.sessions.map((session) =>
          session.id === sessionId
            ? { ...session, title, updatedAt: Date.now() }
            : session
        ),
      }));
    },
    [setAppState]
  );

  const deleteSession = useCallback(
    (sessionId: string) => {
      setAppState((prev) => {
        const newSessions = prev.sessions.filter((s) => s.id !== sessionId);
        const newActiveChatId =
          prev.activeChatId === sessionId
            ? newSessions[0]?.id || null
            : prev.activeChatId;

        return {
          sessions: newSessions,
          activeChatId: newActiveChatId,
        };
      });
    },
    [setAppState]
  );

  return {
    sessions: appState.sessions,
    activeSession,
    activeChatId: appState.activeChatId,
    isLoading,
    setIsLoading,
    createNewSession,
    switchSession,
    addMessage,
    updateSessionTitle,
    deleteSession,
  };
};