
import React, { useState, useEffect, useRef } from 'react';
import { Send, MessageCircle, Calendar, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import ChatAvatar from './ChatAvatar';
import MessageBubble from './MessageBubble';
import TypingIndicator from './TypingIndicator';
import { chatService } from '../services/chatService';

export interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  options?: string[];
}

export type AvatarState = 'idle' | 'listening' | 'thinking' | 'responding' | 'timeout';

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>('idle');
  const [showOptions, setShowOptions] = useState(true);
  const [isFirstVisit, setIsFirstVisit] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const idleTimeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isFirstVisit) {
      setTimeout(() => {
        const welcomeMessage: Message = {
          id: Date.now().toString(),
          text: "Hello! I'm your healthcare assistant. How can I help you today?",
          isUser: false,
          timestamp: new Date()
        };
        setMessages([welcomeMessage]);
        setAvatarState('responding');
        setTimeout(() => setAvatarState('idle'), 2000);
      }, 1000);
      setIsFirstVisit(false);
    }
  }, [isFirstVisit]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    resetIdleTimeout();
    return () => {
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [messages, inputText]);

  const resetIdleTimeout = () => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    idleTimeoutRef.current = setTimeout(() => {
      if (avatarState === 'idle') {
        setAvatarState('timeout');
        setTimeout(() => setAvatarState('idle'), 3000);
      }
    }, 30000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (text: string, isOption: boolean = false) => {
    if (!text.trim()) return;

    setAvatarState('listening');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setShowOptions(false);
    setIsTyping(true);

    setTimeout(() => {
      setAvatarState('thinking');
    }, 500);

    try {
      const response = await chatService.sendMessage(text, isOption);
      
      setTimeout(() => {
        setAvatarState('responding');
        setIsTyping(false);
        
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: response.message,
          isUser: false,
          timestamp: new Date(),
          options: response.options
        };

        setMessages(prev => [...prev, botMessage]);
        
        setTimeout(() => {
          setAvatarState('idle');
        }, 2000);
      }, 1500 + Math.random() * 1000);
    } catch (error) {
      console.error('Error sending message:', error);
      setIsTyping(false);
      setAvatarState('idle');
    }
  };

  const handleOptionSelect = (option: string) => {
    handleSendMessage(option, true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);
    if (e.target.value.length > 0 && avatarState === 'idle') {
      setAvatarState('listening');
    } else if (e.target.value.length === 0 && avatarState === 'listening') {
      setAvatarState('idle');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputText);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl h-[80vh] shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
        <CardContent className="p-0 h-full flex">
          {/* Avatar Section */}
          <div className="w-80 bg-gradient-to-b from-blue-500 to-teal-500 flex flex-col items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <ChatAvatar state={avatarState} />
            </div>
            <div className="absolute bottom-6 left-6 right-6 text-center">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                <p className="text-white text-sm font-medium">
                  Healthcare Assistant
                </p>
                <p className="text-white/80 text-xs mt-1">
                  {avatarState === 'listening' && '👂 Listening...'}
                  {avatarState === 'thinking' && '🤔 Thinking...'}
                  {avatarState === 'responding' && '💬 Responding...'}
                  {avatarState === 'idle' && '😊 Ready to help'}
                  {avatarState === 'timeout' && '👋 Still there?'}
                </p>
              </div>
            </div>
          </div>

          {/* Chat Section */}
          <div className="flex-1 flex flex-col">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white p-4 flex items-center gap-3">
              <MessageCircle className="w-6 h-6" />
              <div>
                <h2 className="font-semibold text-lg">Healthcare Chat</h2>
                <p className="text-blue-100 text-sm">Get instant medical assistance</p>
              </div>
            </div>

            {/* Initial Options */}
            {showOptions && messages.length <= 1 && (
              <div className="p-6 border-b bg-gray-50">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  How can I assist you today?
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    onClick={() => handleOptionSelect('Talk with Doctor')}
                    className="h-16 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Stethoscope className="w-6 h-6 mr-3" />
                    <div>
                      <div className="font-semibold">Talk with Doctor</div>
                      <div className="text-xs opacity-90">Get medical consultation</div>
                    </div>
                  </Button>
                  <Button
                    onClick={() => handleOptionSelect('Book Appointment')}
                    className="h-16 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <Calendar className="w-6 h-6 mr-3" />
                    <div>
                      <div className="font-semibold">Book Appointment</div>
                      <div className="text-xs opacity-90">Schedule your visit</div>
                    </div>
                  </Button>
                </div>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <MessageBubble key={message.id} message={message} onOptionSelect={handleOptionSelect} />
              ))}
              {isTyping && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t bg-white p-4">
              <div className="flex items-center gap-3">
                <Input
                  value={inputText}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message here..."
                  className="flex-1 h-12 rounded-xl border-2 border-gray-200 focus:border-blue-500 transition-colors"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage(inputText)}
                  disabled={!inputText.trim() || isTyping}
                  className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ChatBot;
