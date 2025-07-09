
import React from 'react';
import { Button } from '@/components/ui/button';
import { Message } from './ChatBot';

interface MessageBubbleProps {
  message: Message;
  onOptionSelect?: (option: string) => void;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onOptionSelect }) => {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`animate-slide-in-${message.isUser ? 'right' : 'left'} opacity-0 animate-fade-in`}>
      <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs lg:max-w-md ${message.isUser ? 'order-2' : 'order-1'}`}>
          {/* Avatar */}
          <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-2`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              message.isUser 
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white' 
                : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-600'
            }`}>
              {message.isUser ? 'You' : '🏥'}
            </div>
          </div>
          
          {/* Message Bubble */}
          <div
            className={`px-4 py-3 rounded-2xl shadow-lg animate-message-pop ${
              message.isUser
                ? 'bg-gradient-to-r from-blue-500 to-teal-500 text-white rounded-br-sm'
                : 'bg-white border border-gray-200 text-gray-800 rounded-bl-sm'
            }`}
          >
            <p className="text-sm leading-relaxed">{message.text}</p>
            
            {/* Options */}
            {message.options && message.options.length > 0 && (
              <div className="mt-3 space-y-2">
                {message.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => onOptionSelect?.(option)}
                    variant="outline"
                    size="sm"
                    className="w-full justify-start text-left h-auto p-3 bg-gray-50 hover:bg-blue-50 border-gray-200 hover:border-blue-300 text-gray-700 hover:text-blue-700 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="text-blue-500 mr-2">→</span>
                    {option}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          {/* Timestamp */}
          <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mt-1`}>
            <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
