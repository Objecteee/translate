import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './components/MessageBubble';
import { RecordButton } from './components/RecordButton';
import { Mic } from 'lucide-react';

interface Message {
  id: string;
  speaker: 'bottom' | 'top';
  originalText: string;
  translatedText: string;
  timestamp: number;
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeRecorder, setActiveRecorder] = useState<'bottom' | 'top' | null>(null);
  const [isProcessing, setIsProcessing] = useState<'bottom' | 'top' | null>(null);
  const bottomContainerRef = useRef<HTMLDivElement>(null);
  const topContainerRef = useRef<HTMLDivElement>(null);

  // Mock translation function
  const mockTranslate = (text: string, fromLang: string): { original: string; translated: string } => {
    const translations: Record<string, string> = {
      '你好': 'Hello',
      '早上好': 'Good morning',
      '谢谢': 'Thank you',
      '再见': 'Goodbye',
      'Hello': '你好',
      'Good morning': '早上好',
      'Thank you': '谢谢',
      'Goodbye': '再见',
      'How are you': '你好吗',
      '你好吗': 'How are you',
    };

    const translated = translations[text] || (fromLang === 'CN' ? 'Nice to meet you' : '很高兴见到你');
    return { original: text, translated };
  };

  // Mock speech recognition
  const mockRecognition = (speaker: 'bottom' | 'top'): string => {
    const cnPhrases = ['你好', '早上好', '谢谢', '再见', '你好吗'];
    const enPhrases = ['Hello', 'Good morning', 'Thank you', 'Goodbye', 'How are you'];
    const phrases = speaker === 'bottom' ? cnPhrases : enPhrases;
    return phrases[Math.floor(Math.random() * phrases.length)];
  };

  const handleRecordStart = (speaker: 'bottom' | 'top') => {
    setActiveRecorder(speaker);
  };

  const handleRecordEnd = async (speaker: 'bottom' | 'top') => {
    setActiveRecorder(null);
    setIsProcessing(speaker);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const recognizedText = mockRecognition(speaker);
    const fromLang = speaker === 'bottom' ? 'CN' : 'EN';
    const { original, translated } = mockTranslate(recognizedText, fromLang);

    const newMessage: Message = {
      id: Date.now().toString(),
      speaker,
      originalText: original,
      translatedText: translated,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, newMessage]);
    setIsProcessing(null);

    // Auto-play TTS (mock)
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(translated);
      utterance.lang = speaker === 'bottom' ? 'en-US' : 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleBubbleClick = (message: Message) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message.translatedText);
      utterance.lang = message.speaker === 'bottom' ? 'en-US' : 'zh-CN';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  useEffect(() => {
    if (bottomContainerRef.current) {
      bottomContainerRef.current.scrollTop = bottomContainerRef.current.scrollHeight;
    }
    if (topContainerRef.current) {
      topContainerRef.current.scrollTop = topContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-gray-50 via-blue-50 to-gray-50 relative">
      {/* Top Half (Rotated 180deg) */}
      <div className="absolute top-0 left-0 right-0 h-1/2 transform rotate-180 flex flex-col-reverse">
        <RecordButton
          position="top"
          isActive={activeRecorder === 'top'}
          isLocked={activeRecorder === 'bottom'}
          isProcessing={isProcessing === 'top'}
          onRecordStart={() => handleRecordStart('top')}
          onRecordEnd={() => handleRecordEnd('top')}
          sourceLang="EN"
          targetLang="CN"
        />
        
        <div 
          ref={topContainerRef}
          className="flex-1 overflow-y-auto px-4 pb-6 pt-24 scrollbar-hide"
          style={{
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                viewerPosition="top"
                onClick={() => handleBubbleClick(message)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Center Divider Line with Breathing Effect */}
      <div className="absolute top-1/2 left-0 right-0 h-[2px] -translate-y-1/2 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-40 animate-pulse" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-300 to-transparent animate-breath" />
      </div>

      {/* Bottom Half */}
      <div className="absolute bottom-0 left-0 right-0 h-1/2 flex flex-col">
        <div 
          ref={bottomContainerRef}
          className="flex-1 overflow-y-auto px-4 pt-6 pb-24 scrollbar-hide"
          style={{
            maskImage: 'linear-gradient(to top, transparent 0%, black 10%, black 90%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <div className="flex flex-col gap-4">
            {messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                viewerPosition="bottom"
                onClick={() => handleBubbleClick(message)}
              />
            ))}
          </div>
        </div>

        <RecordButton
          position="bottom"
          isActive={activeRecorder === 'bottom'}
          isLocked={activeRecorder === 'top'}
          isProcessing={isProcessing === 'bottom'}
          onRecordStart={() => handleRecordStart('bottom')}
          onRecordEnd={() => handleRecordEnd('bottom')}
          sourceLang="CN"
          targetLang="EN"
        />
      </div>
    </div>
  );
}