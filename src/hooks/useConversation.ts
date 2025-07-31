import { useRef, useCallback, useEffect, useState } from 'react';
import { Conversation } from '@elevenlabs/client';

interface ConversationMessage {
  id?: string;
  message: string;
  source: 'user' | 'ai';
}

interface ConversationHandlers {
  onMessage: (message: ConversationMessage) => void;
  onDisconnect: () => void;
  clientTools?: Record<string, (params: any) => void>;
  onStatusChange?: (status: string) => void;
}

type ConversationInstance = Conversation & {
  status?: string;
  mode?: string;
  connection?: {
    sendMessage: (message: { type: string; text: string }) => void;
  };
  handleEndSession?: () => void;
};

export const useConversation = ({
  onMessage,
  onDisconnect,
  clientTools,
  onStatusChange,
}: ConversationHandlers) => {
  const conversationRef = useRef<ConversationInstance | null>(null);
  const [status, setStatus] = useState<string>();
  const [mode, setMode] = useState<string>();

  const initiate = useCallback(async () => {
    try {
      const conversation = await Conversation.startSession({
        agentId: import.meta.env.VITE_AGENT_ID,
        onMessage,
        onDisconnect,
        clientTools,
      });

      conversationRef.current = conversation as ConversationInstance;
      conversation.setVolume({ volume: 0.5 });
    } catch (error) {
      console.error('Failed to initiate conversation:', error);
    }
  }, [onMessage, onDisconnect, clientTools]);

  const sendMessage = useCallback((text: string) => {
    if (!conversationRef.current) return;
    
    conversationRef.current.connection?.sendMessage({
      type: 'user_message',
      text,
    });
  }, []);

  const endSession = useCallback(() => {
    conversationRef.current?.handleEndSession?.();
  }, []);

  useEffect(() => {
    initiate();
    return () => {
      endSession();
    };
  }, []);

  useEffect(() => {
    if (conversationRef.current) {
      const conversation = conversationRef.current as any;
      const currentStatus = conversation.status;
      const currentMode = conversation.mode;
      
      if (currentStatus !== status) {
        setStatus(currentStatus);
        onStatusChange?.(currentStatus!);
      }
      
      if (currentMode !== mode) {
        setMode(currentMode);
      }
    }
  });

  return {
    conversation: conversationRef.current,
    status,
    mode,
    sendMessage,
    initiate,
    endSession,
  };
};