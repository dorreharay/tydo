import { useState } from 'react';
import type { ReactNode } from 'react';
import { VoiceContext, type VoiceTranscription } from './voice-context';

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