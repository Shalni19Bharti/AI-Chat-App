import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 px-5 py-3 rounded-2xl rounded-bl-md shadow-md">
      <div className="flex items-center space-x-3">
        <div className="flex space-x-1.5">
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;