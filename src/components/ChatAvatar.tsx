
import React from 'react';
import { AvatarState } from './ChatBot';
import doctorListening from '../assets/doctor-listening.png';
import doctorResponding from '../assets/doctor-responding.png';

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

  const getDoctorImage = () => {
    if (state === 'responding') {
      return doctorResponding;
    }
    return doctorListening;
  };

  const getStatusText = () => {
    switch (state) {
      case 'listening':
        return 'Listening';
      case 'thinking':
        return 'Thinking';
      case 'responding':
        return 'Responding';
      case 'timeout':
        return 'Still there?';
      default:
        return 'Ready to help';
    }
  };

  return (
    <div className={getAvatarClasses()}>
      {/* Main Avatar Container */}
      <div className="relative w-48 h-48">
        {/* Background Glow */}
        <div className="absolute inset-0 bg-white/20 rounded-lg blur-xl animate-pulse-glow"></div>
        
        {/* Doctor Avatar Image */}
        <div className="relative w-full h-full rounded-lg shadow-2xl overflow-hidden border-4 border-white/30 bg-gradient-to-br from-blue-500 to-blue-600">
          <img 
            src={getDoctorImage()} 
            alt={`Doctor ${getStatusText()}`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              state === 'responding' ? 'animate-doctor-speaking' : ''
            }`}
          />
          
          {/* Status Badge */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
            <div className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
              {getStatusText()}
            </div>
          </div>
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
