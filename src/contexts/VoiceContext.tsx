import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

interface VoiceTranscription {
  text: string;
  timestamp: Date;
}

interface VoiceContextType {
  lastTranscription: VoiceTranscription | null;
  setLastTranscription: (transcription: VoiceTranscription | null) => void;
  shouldStartRecording: boolean;
  setShouldStartRecording: (value: boolean) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export function VoiceProvider({ children }: { children: ReactNode }) {
  const [lastTranscription, setLastTranscription] = useState<VoiceTranscription | null>(null);
  const [shouldStartRecording, setShouldStartRecording] = useState(false);

  return (
    <VoiceContext.Provider value={{ 
      lastTranscription, 
      setLastTranscription,
      shouldStartRecording,
      setShouldStartRecording 
    }}>
      {children}
    </VoiceContext.Provider>
  );
}

export function useVoice() {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
}