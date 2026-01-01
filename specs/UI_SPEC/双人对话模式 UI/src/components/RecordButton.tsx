import { Mic, Lock, Loader2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

interface RecordButtonProps {
  position: 'top' | 'bottom';
  isActive: boolean;
  isLocked: boolean;
  isProcessing: boolean;
  onRecordStart: () => void;
  onRecordEnd: () => void;
  sourceLang: string;
  targetLang: string;
}

export function RecordButton({
  position,
  isActive,
  isLocked,
  isProcessing,
  onRecordStart,
  onRecordEnd,
  sourceLang,
  targetLang,
}: RecordButtonProps) {
  const handleMouseDown = () => {
    if (!isLocked && !isProcessing) {
      onRecordStart();
    }
  };

  const handleMouseUp = () => {
    if (isActive) {
      onRecordEnd();
    }
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.preventDefault();
    if (!isLocked && !isProcessing) {
      onRecordStart();
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    e.preventDefault();
    if (isActive) {
      onRecordEnd();
    }
  };

  const getFlag = (lang: string) => {
    return lang === 'CN' ? '🇨🇳' : '🇬🇧';
  };

  const getLangName = (lang: string) => {
    return lang === 'CN' ? '中文' : 'English';
  };

  return (
    <div className="flex flex-col items-center justify-center py-6 px-4 relative z-10 gap-3">
      {/* Language conversion indicator */}
      <div className="flex items-center gap-2 text-gray-600">
        <span className="flex items-center gap-1">
          <span className="text-lg">{getFlag(sourceLang)}</span>
          <span className="select-none">{getLangName(sourceLang)}</span>
        </span>
        <ArrowRight className="w-4 h-4" />
        <span className="flex items-center gap-1">
          <span className="text-lg">{getFlag(targetLang)}</span>
          <span className="select-none">{getLangName(targetLang)}</span>
        </span>
      </div>

      {/* Record button */}
      <div className="relative">
        <button
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          disabled={isLocked || isProcessing}
          className={`
            relative w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300
            ${isActive 
              ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-xl shadow-emerald-500/40 scale-110' 
              : isLocked || isProcessing
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-gradient-to-br from-blue-400 to-blue-600 shadow-lg hover:shadow-xl hover:scale-105 active:scale-95'
            }
          `}
        >
          {/* Outer ring animation when active */}
          {isActive && (
            <motion.div
              className="absolute inset-0 rounded-full border-2 border-emerald-300/50"
              animate={{ scale: [1, 1.3, 1.3], opacity: [0.5, 0, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          )}

          {/* Icon */}
          {isProcessing ? (
            <Loader2 className="w-8 h-8 text-white animate-spin" />
          ) : isLocked ? (
            <Lock className="w-7 h-7 text-white/50" />
          ) : (
            <Mic className={`w-8 h-8 text-white transition-transform ${isActive ? 'scale-110' : ''}`} />
          )}

          {/* Sound wave animation when active */}
          {isActive && (
            <div className="absolute -bottom-10 flex gap-1">
              <motion.div
                className="w-1 bg-emerald-500 rounded-full"
                animate={{ height: [4, 14, 4] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
              />
              <motion.div
                className="w-1 bg-emerald-500 rounded-full"
                animate={{ height: [8, 18, 8] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }}
              />
              <motion.div
                className="w-1 bg-emerald-500 rounded-full"
                animate={{ height: [4, 14, 4] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              />
              <motion.div
                className="w-1 bg-emerald-500 rounded-full"
                animate={{ height: [6, 12, 6] }}
                transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }}
              />
            </div>
          )}
        </button>

        {/* Status text */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-emerald-600 select-none whitespace-nowrap"
          >
            正在录音...
          </motion.div>
        )}
        {isProcessing && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-blue-600 select-none whitespace-nowrap"
          >
            处理中...
          </motion.div>
        )}
      </div>
    </div>
  );
}
