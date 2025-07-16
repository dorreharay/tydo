import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquareDashed,
  Send,
  AudioLines,
  LoaderCircle,
} from 'lucide-react';
import { cn } from '@lib/utils';
import Header from '@/components/Header';
import { useVoice } from '@contexts/VoiceContext';
import type { ChartPeriod } from '@hooks/useChartData';
import { useConversation } from '@elevenlabs/react';
import { useLocation } from 'react-router-dom';

interface Message {
  id?: string;
  message: string;
  source: 'user' | 'ai';
  showChart?: boolean;
  chartPeriod?: ChartPeriod;
  visualizationType?: 'sales' | 'products' | 'customers' | 'general';
}

function ChatPage() {
  const { setShouldStartRecording } = useVoice();
  const [messages, setMessages] = useState<Message[]>([]);
  const [, setInitialLoading] = useState(true);

  const { search } = useLocation();

  const isVoicePreselected = search.includes('voice=true');

  const conversation = useConversation({
    onConnect: state => {
      console.log('connect state', state);
    },
    onAudio: state => {
      console.log('audio state', state);
    },
    onDisconnect: () => {
      console.log('DISCONNECTED');

      setMessages(prev => [
        ...prev,
        { message: 'Session Ended', source: 'ai', id: 0 },
      ]);
    },
    onMessage: message => {
      console.log('MESSAGE', message);
      const messageWithId = {
        ...message,
        id: message.id || Date.now().toString(),
      };
      setMessages(prev => [...prev, messageWithId]);

      if (message.source === 'ai') {
        setShowUserListening(true);
      }
    },
  });

  console.log('conversation', conversation);

  const { startSession, endSession, sendUserMessage, isSpeaking, status } =
    conversation;

  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showAISpeaking, setShowAISpeaking] = useState(false);
  const [showUserListening, setShowUserListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const handleAIResponse = useCallback(() => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const handleFocus = (e: FocusEvent) => {
      if (e.target === inputRef.current) {
        e.preventDefault();
        window.scrollTo(0, 0);
        document.body.scrollTop = 0;
        document.documentElement.scrollTop = 0;

        if (containerRef.current) {
          containerRef.current.scrollTop = 0;
        }
      }
    };

    const input = inputRef.current;
    if (input) {
      input.addEventListener('focus', handleFocus, { passive: false });
      input.addEventListener('click', handleFocus, { passive: false });
    }

    return () => {
      if (input) {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('click', handleFocus);
      }
    };
  }, []);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop =
          messagesContainerRef.current.scrollHeight;
      }
    };

    setTimeout(scrollToBottom, 100);
  }, [messages]);

  useEffect(() => {}, [handleAIResponse]);

  // Handle delayed appearance of AI speaking indicator
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (status === 'connected' && isSpeaking) {
      timeout = setTimeout(() => {
        setShowAISpeaking(true);
      }, 2000); // 2 second delay
    } else {
      setShowAISpeaking(false);
    }
    return () => clearTimeout(timeout);
  }, [status, isSpeaking]);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      message: inputValue,
      source: 'user',
    };

    setShowUserListening(false);

    sendUserMessage(inputValue);

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    handleAIResponse();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleVoiceClick = useCallback(async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      await startSession({
        agentId: 'agent_01k09khggefxpaz11w4veq5q0c',
        connectionType: 'webrtc',
        // clientTools: {
        //   logMessage: async ({ message }) => {
        //     alert(message);
        //   },
        // },
      });

      setShouldStartRecording(true);
    } catch (error) {
      console.log('error', error);
    } finally {
      setInitialLoading(false);
    }
  }, [setShouldStartRecording, startSession]);

  useEffect(() => {
    if (isVoicePreselected) {
      handleVoiceClick();
    } else {
      startSession({
        agentId: 'agent_01k09khggefxpaz11w4veq5q0c',
        connectionType: 'webrtc',
        // clientTools: {
        //   logMessage: async ({ message }) => {
        //     alert(message);
        //   },
        // },
      });
      setInitialLoading(false);
    }
  }, [handleVoiceClick, isVoicePreselected]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden text-gray-900 transition-all duration-100 h-screen-safe dark:bg-stone-900 dark:text-gray-100"
    >
      <div className="flex flex-col h-full pt-8 mx-auto">
        <div className="px-4">
          <Header canGoBack={true}>
            <>
              <MessageSquareDashed className="w-5 h-5" />
              {status === 'connecting'
                ? 'Connecting...'
                : status === 'connected'
                  ? isSpeaking
                    ? 'Tydo is speaking...'
                    : 'Tydo is ready'
                  : 'Chat with Tydo'}
            </>
          </Header>
        </div>

        <div
          ref={messagesContainerRef}
          className="flex flex-col flex-1 gap-4 p-4 mt-6 overflow-y-auto border-none bg-stone-100 dark:bg-stone-800 rounded-t-3xl -webkit-overflow-scrolling-touch overscroll-none"
        >
          {!messages?.length &&
          status !== 'connecting' &&
          status !== 'connected' &&
          status !== 'disconnected' ? (
            <div className="flex flex-col gap-8 my-auto">
              <div className="font-euclid text-stone-400">
                To start communication please send a message or start audio
                session
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleVoiceClick}
                  className="flex items-center justify-center gap-2 p-3 transition-colors bg-white rounded-full dark:bg-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 font-euclid-m text-stone-300"
                >
                  <AudioLines className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  Start Voice Chat
                </button>
                <button
                  onClick={() => inputRef.current?.focus()}
                  className="flex items-center justify-center gap-2 p-3 transition-colors bg-white rounded-full dark:bg-stone-700 hover:bg-stone-100 dark:hover:bg-stone-700 font-euclid-m text-stone-300"
                >
                  <Send className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  Send Message
                </button>
              </div>
            </div>
          ) : null}

          {status === 'connecting' && (
            <div className="flex flex-col items-center gap-4 my-auto">
              <LoaderCircle className="relative w-12 h-12 text-stone-400 animate-spin" />
              <p className="text-md text-stone-600 dark:text-stone-400 font-euclid">
                Connecting to Tydo...
              </p>
            </div>
          )}

          {messages.map(message => (
            <div key={message.id} className="space-y-2 border-none">
              <div
                className={cn(
                  'flex border-none',
                  message.source === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'flex flex-col max-w-[80%] p-3 rounded-2xl border-none',
                    message.source === 'user'
                      ? 'bg-rose-800 text-white'
                      : 'bg-stone-100 dark:bg-stone-900 text-gray-900 dark:text-gray-100'
                  )}
                >
                  <p className="text-left text-md font-euclid">
                    {message.message}
                  </p>
                </div>
              </div>
              {/* {message.showChart && message.source === 'ai' && (
                <MessageChart
                  messageId={message.id}
                  messageContent={message.message}
                  chartPeriod={message.chartPeriod}
                  visualizationType={message.visualizationType}
                />
              )} */}
            </div>
          ))}

          {showUserListening && (
            <div className="flex justify-end">
              <div className="p-5 rounded-full bg-rose-800">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce" />
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1 h-1 bg-white rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {status === 'connected' &&
            !showUserListening &&
            messages.length > 0 && (
              <div className="flex justify-start">
                <div className="p-5 rounded-full bg-stone-100 dark:bg-stone-900">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      <div className="w-1 h-1 rounded-full bg-stone-600 dark:bg-stone-400 animate-bounce" />
                      <div className="w-1 h-1 bg-stone-600 dark:bg-stone-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1 h-1 bg-stone-600 dark:bg-stone-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              </div>
            )}
        </div>

        <div className="w-full p-4 border-t dark:border-stone-800 dark:bg-stone-900 bg-stone-200 border-stone-100">
          <div className="flex gap-2">
            <button
              onClick={handleVoiceClick}
              className={cn(
                'p-3 transition-colors bg-white rounded-full dark:bg-stone-800 hover:bg-stone-100 dark:hover:bg-stone-700',
                status === 'connected' ? 'bg-rose-800 hover:bg-rose-700' : ''
              )}
              disabled
            >
              <AudioLines className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 bg-white border rounded-full border-stone-300 dark:border-stone-800 dark:bg-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 font-euclid placeholder:text-stone-500"
            />
            <button
              onClick={handleSendMessage}
              disabled={
                !inputValue.trim() || isLoading || status !== 'connected'
              }
              className={cn(
                'p-3 rounded-full transition-colors',
                inputValue.trim() && !isLoading && status === 'connected'
                  ? 'bg-rose-800 text-white hover:bg-rose-700'
                  : 'bg-stone-200 dark:bg-stone-700 text-gray-400 cursor-not-allowed'
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChatPage;
