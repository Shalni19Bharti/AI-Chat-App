import React, { useState, useRef, type KeyboardEvent } from 'react';
import { Send, Loader2 } from 'lucide-react';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (trimmedMessage && !disabled) {
      onSendMessage(trimmedMessage);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="p-4 md:p-6 shrink-0">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center">
          <div className="relative max-w-[95%] md:max-w-[85%] w-full">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
              placeholder="Ask me anything you want to know..."
              disabled={disabled}
              rows={1}
              className="
                w-full px-5 py-5 pr-14
                bg-gray-50 dark:bg-gray-700
                border border-gray-300 dark:border-gray-600
                rounded-[30px] resize-none
                text-gray-900 dark:text-gray-100
                placeholder-gray-500 dark:placeholder-gray-400
                disabled:opacity-50 disabled:cursor-not-allowed
                max-h-32 overflow-y-auto
                transition-all duration-200
                [&::-webkit-scrollbar]:hidden
                [-ms-overflow-style:none]
                [scrollbar-width:none]
              "
              style={{ minHeight: '64px' }}
            />
            {message.trim().length > 0 && (
              <button
                onClick={handleSend}
                disabled={disabled}
                className="
                  absolute right-2 top-1/2 -translate-y-1/2
                  p-2.5 bg-blue-500 hover:bg-blue-600
                  text-white rounded-full
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  flex items-center justify-center
                  shadow-sm hover:shadow-md
                "
                aria-label="Send message"
              >
                {disabled ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;