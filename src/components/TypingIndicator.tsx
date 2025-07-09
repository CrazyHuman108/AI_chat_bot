
import React from 'react';

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex justify-start mb-4 animate-fade-in">
      <div className="max-w-xs lg:max-w-md">
        {/* Avatar */}
        <div className="flex justify-start mb-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600 flex items-center justify-center text-sm font-medium">
            🏥
          </div>
        </div>
        
        {/* Typing Bubble */}
        <div className="bg-white border border-gray-200 px-6 py-4 rounded-2xl rounded-bl-sm shadow-lg">
          <div className="flex items-center space-x-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-typing-dot" style={{ animationDelay: '300ms' }}></div>
            </div>
            <span className="text-xs text-gray-500 ml-2">AI is typing...</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;
