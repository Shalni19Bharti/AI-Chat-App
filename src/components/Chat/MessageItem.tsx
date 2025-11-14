import React from 'react';
import { User, Bot } from 'lucide-react';
import type { Message } from '../../types';
import { formatTimestamp } from '../../utils/helpers';

interface MessageItemProps {
  message: Message;
}

const MessageItem: React.FC<MessageItemProps> = ({ message }) => {
  const isUser = message.role === 'user';

  if (!message.content) {
    return null;
  }

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-6 animate-fadeIn w-full`}
      style={{ display: 'flex' }}
    >
      <div className={`flex ${isUser ? 'flex-row-reverse' : 'flex-row'} items-start max-w-[85%] md:max-w-[75%] w-full`}>
        <div
          className={`
            shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md
            ${isUser
              ? 'bg-blue-500 ml-3'
              : 'bg-purple-500 mr-3'
            }
          `}
          style={{ flexShrink: 0 }}
        >
          {isUser ? (   
            <User className="w-6 h-6 text-white" />
          ) : (
            <Bot className="w-6 h-6 text-white" />
          )}
        </div>

        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} flex-1 min-w-0`}>
          <div className="flex items-center space-x-2 mb-1 px-1">
            <span className={`text-xs font-semibold ${isUser ? 'text-blue-600 dark:text-blue-400' : 'text-purple-600 dark:text-purple-400'}`}>
              {isUser ? 'You' : 'AI'}
            </span>
          </div>
          <div
            className={`
              px-5 py-3 rounded-2xl shadow-md transition-all duration-200 hover:shadow-lg
              ${isUser
                ? 'bg-blue-500 rounded-br-md'
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-bl-md'
              }
            `}
            style={{
              backgroundColor: isUser ? '#3b82f6' : undefined,
              color: isUser ? '#ffffff' : undefined,
            }}
          >
            <p
              className={`
                text-sm leading-relaxed whitespace-pre-wrap wrap-break-word
                ${isUser
                  ? 'text-white font-medium'
                  : 'text-gray-800 dark:text-gray-100'
                }
              `}
              style={{
                color: isUser ? '#ffffff' : undefined,
              }}
            >
              {message.content}
            </p>
          </div>
          <span className={`text-xs mt-1.5 px-1 ${isUser ? 'text-gray-500 dark:text-gray-400' : 'text-gray-400 dark:text-gray-500'}`}>
            {formatTimestamp(message.timestamp)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MessageItem;