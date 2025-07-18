import { createContext } from 'react';

export interface VoiceTranscription {
  text: string;
  timestamp: Date;
}

export interface VoiceContextType {
  lastTranscription: VoiceTranscription | null;
  setLastTranscription: (transcription: VoiceTranscription | null) => void;
  shouldStartRecording: boolean;
  setShouldStartRecording: (value: boolean) => void;
}

export const VoiceContext = createContext<VoiceContextType | undefined>(undefined);