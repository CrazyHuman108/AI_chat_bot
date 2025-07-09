
import React from 'react';
import { AvatarState } from './ChatBot';

interface ChatAvatarProps {
  state: AvatarState;
}

const ChatAvatar: React.FC<ChatAvatarProps> = ({ state }) => {
  const getAvatarClasses = () => {
    const baseClasses = "relative transition-all duration-500 ease-in-out";
    switch (state) {
      case 'listening':
        return `${baseClasses} animate-pulse transform rotate-2`;
      case 'thinking':
        return `${baseClasses} animate-bounce`;
      case 'responding':
        return `${baseClasses} animate-pulse`;
      case 'timeout':
        return `${baseClasses} animate-wiggle`;
      default:
        return `${baseClasses} animate-breathing`;
    }
  };

  const getEyeAnimation = () => {
    switch (state) {
      case 'listening':
        return 'animate-blink-slow';
      case 'thinking':
        return 'animate-eye-roll';
      case 'responding':
        return 'animate-blink-fast';
      case 'timeout':
        return 'animate-wink';
      default:
        return 'animate-blink';
    }
  };

  const getMouthShape = () => {
    switch (state) {
      case 'listening':
        return 'M12 16c-2 0-4-1-4-2s2-2 4-2 4 1 4 2-2 2-4 2z'; // Slight smile
      case 'thinking':
        return 'M8 16h8'; // Straight line (thinking)
      case 'responding':
        return 'M8 14c0 2 2 4 4 4s4-2 4-4'; // Open mouth (talking)
      case 'timeout':
        return 'M12 16c-2 0-4-1-4-2s2-2 4-2 4 1 4 2-2 2-4 2z'; // Friendly smile
      default:
        return 'M8 16c0-2 2-3 4-3s4 1 4 3'; // Neutral smile
    }
  };

  return (
    <div className={getAvatarClasses()}>
      {/* Main Avatar Container */}
      <div className="relative w-48 h-48">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-xl animate-pulse-glow"></div>
        
        {/* Avatar Circle */}
        <div className="relative w-full h-full bg-white rounded-full shadow-2xl overflow-hidden border-4 border-white/30">
          {/* Face */}
          <svg viewBox="0 0 24 24" className="w-full h-full p-6">
            {/* Head circle */}
            <circle cx="12" cy="12" r="10" fill="#fbbf24" stroke="#f59e0b" strokeWidth="0.5"/>
            
            {/* Eyes */}
            <g className={getEyeAnimation()}>
              <circle cx="9" cy="10" r="1.5" fill="#1f2937"/>
              <circle cx="15" cy="10" r="1.5" fill="#1f2937"/>
              {/* Eye highlights */}
              <circle cx="9.5" cy="9.5" r="0.5" fill="white"/>
              <circle cx="15.5" cy="9.5" r="0.5" fill="white"/>
            </g>
            
            {/* Eyebrows */}
            <path d="M7 8c1-0.5 3-0.5 4 0" stroke="#1f2937" strokeWidth="0.8" strokeLinecap="round" fill="none"/>
            <path d="M13 8c1-0.5 3-0.5 4 0" stroke="#1f2937" strokeWidth="0.8" strokeLinecap="round" fill="none"/>
            
            {/* Mouth */}
            <path 
              d={getMouthShape()} 
              stroke="#1f2937" 
              strokeWidth="1" 
              strokeLinecap="round" 
              fill={state === 'responding' ? '#dc2626' : 'none'}
              className={state === 'responding' ? 'animate-mouth-talk' : ''}
            />
            
            {/* Cheeks (blush) */}
            {(state === 'listening' || state === 'timeout') && (
              <>
                <circle cx="6" cy="13" r="1.5" fill="#fecaca" opacity="0.6"/>
                <circle cx="18" cy="13" r="1.5" fill="#fecaca" opacity="0.6"/>
              </>
            )}
          </svg>
        </div>
        
        {/* Thinking dots */}
        {state === 'thinking' && (
          <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Sound waves for responding */}
        {state === 'responding' && (
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-8">
            <div className="flex items-center space-x-1">
              <div className="w-1 bg-white rounded-full animate-sound-wave" style={{ height: '20px', animationDelay: '0ms' }}></div>
              <div className="w-1 bg-white rounded-full animate-sound-wave" style={{ height: '30px', animationDelay: '100ms' }}></div>
              <div className="w-1 bg-white rounded-full animate-sound-wave" style={{ height: '25px', animationDelay: '200ms' }}></div>
              <div className="w-1 bg-white rounded-full animate-sound-wave" style={{ height: '35px', animationDelay: '300ms' }}></div>
            </div>
          </div>
        )}
        
        {/* Timeout wave */}
        {state === 'timeout' && (
          <div className="absolute -right-4 top-8">
            <div className="text-4xl animate-wave">👋</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatAvatar;
