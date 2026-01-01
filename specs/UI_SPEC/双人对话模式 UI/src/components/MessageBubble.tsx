import { motion } from 'motion/react';
import { Volume2 } from 'lucide-react';

interface Message {
  id: string;
  speaker: 'bottom' | 'top';
  originalText: string;
  translatedText: string;
  timestamp: number;
}

interface MessageBubbleProps {
  message: Message;
  viewerPosition: 'bottom' | 'top';
  onClick: () => void;
}

export function MessageBubble({ message, viewerPosition, onClick }: MessageBubbleProps) {
  // Determine if this is "my" message from the viewer's perspective
  const isMyMessage = message.speaker === viewerPosition;
  
  // Determine what to show as primary (big) and secondary (small) text
  // For bottom viewer (CN speaker): always show EN as big text, CN as small text
  // For top viewer (EN speaker): always show CN as big text, EN as small text
  const getPrimaryText = () => {
    if (viewerPosition === 'bottom') {
      // Bottom viewer wants to see English (target language) as big text
      return message.speaker === 'bottom' ? message.translatedText : message.originalText;
    } else {
      // Top viewer wants to see Chinese (target language) as big text
      return message.speaker === 'top' ? message.translatedText : message.originalText;
    }
  };

  const getSecondaryText = () => {
    if (viewerPosition === 'bottom') {
      // Bottom viewer's native language is Chinese (show as small text)
      return message.speaker === 'bottom' ? message.originalText : message.translatedText;
    } else {
      // Top viewer's native language is English (show as small text)
      return message.speaker === 'top' ? message.originalText : message.translatedText;
    }
  };
  
  // Determine bubble color based on viewer position and speaker
  const getBubbleColor = () => {
    if (isMyMessage) {
      // My messages: green for bottom viewer, blue for top viewer
      return viewerPosition === 'bottom' 
        ? 'bg-green-500' 
        : 'bg-blue-500';
    } else {
      // Other's messages: white with border
      return 'bg-white border-2 border-gray-200';
    }
  };

  // Text color
  const getTextColor = () => {
    return isMyMessage ? 'text-white' : 'text-gray-900';
  };

  const getSecondaryTextColor = () => {
    return isMyMessage ? 'text-white/60' : 'text-gray-400';
  };

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: 'spring', 
        stiffness: 300, 
        damping: 20,
        duration: 0.4 
      }}
      className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}
    >
      <div className="relative max-w-[75%]">
        <div
          className={`${getBubbleColor()} rounded-3xl px-6 py-4 shadow-md`}
        >
          {/* Primary Text (Target Language - Big) - 24pt+ bold */}
          <div className={`${getTextColor()} mb-2 select-none text-2xl`}>
            {getPrimaryText()}
          </div>

          {/* Secondary Text (Native Language - Small) - 12pt light */}
          <div className={`${getSecondaryTextColor()} select-none`} style={{ fontSize: '12pt' }}>
            {getSecondaryText()}
          </div>
        </div>

        {/* Speaker Button */}
        <button
          onClick={onClick}
          className={`absolute -bottom-2 ${isMyMessage ? '-left-2' : '-right-2'} w-10 h-10 rounded-full ${
            isMyMessage 
              ? viewerPosition === 'bottom' ? 'bg-green-600' : 'bg-blue-600'
              : 'bg-gray-300'
          } shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-transform`}
          aria-label="播放语音"
        >
          <Volume2 className={`w-5 h-5 ${isMyMessage ? 'text-white' : 'text-gray-600'}`} />
        </button>
      </div>
    </motion.div>
  );
}
