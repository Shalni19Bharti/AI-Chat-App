import React, { useEffect, useRef } from 'react';
import { MessageCircle, Bot } from 'lucide-react';
import type { Message } from '../../types';
import MessageItem from './MessageItem';
import LoadingIndicator from '../Indicator/TypingIndicator';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center max-w-lg">
          <div className="mb-6 relative">
            <div className="w-20 h-20 mx-auto bg-linear-to-br from-purple-100 to-blue-100 dark:from-purple-900/30 dark:to-blue-900/30 rounded-3xl flex items-center justify-center">
              <MessageCircle className="w-10 h-10 text-purple-500 dark:text-purple-400" />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
            Start a conversation
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            Send a message below to begin chatting with the AI assistant. Ask questions, get help, or have a conversation!
          </p>
          <div className="grid grid-cols-1 gap-3 text-left">
            {[
              { icon: '💡', text: 'Ask me anything you want to know' },
              { icon: '🚀', text: 'Get help with your projects' },
              { icon: '💬', text: 'Have a natural conversation' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
                <span className="text-2xl">{item.icon}</span>
                <span className="text-sm text-gray-700 dark:text-gray-300">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        {messages.map((message) => {
          if (!message || !message.id || !message.content) {
            return null;
          }
          return <MessageItem key={message.id} message={message} />;
        })}
        {isLoading && (
          <div className="flex justify-start mb-6">
            <div className="flex items-start space-x-3 max-w-[85%] md:max-w-[75%] w-full">
              <div className="shrink-0 w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <LoadingIndicator />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default MessageList;