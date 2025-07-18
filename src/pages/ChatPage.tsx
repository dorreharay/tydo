/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect, useRef, useCallback } from 'react';
import { MessageSquareDashed, LoaderCircle, RefreshCcw } from 'lucide-react';
import { cn } from '@lib/utils';
import Header from '@/components/Header';
import type { ChartPeriod } from '@hooks/useChartData';
import { Conversation } from '@elevenlabs/client';
import { useParams } from 'react-router-dom';

interface Message {
  id?: string;
  message: string;
  source: 'user' | 'ai';
  showChart?: boolean;
  chartPeriod?: ChartPeriod;
  visualizationType?: 'sales' | 'products' | 'customers' | 'general';
}

function ChatPage() {
  const { text } = useParams();
  const [messages, setMessages] = useState<Message[]>([]);

  const [showUserListening, setShowUserListening] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const conversationRef = useRef<any>(null);

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

  const initiate = useCallback(async () => {
    try {
      const conversation = await Conversation.startSession({
        agentId: 'agent_01k09khggefxpaz11w4veq5q0c',
        onMessage: message => {
          const messageWithId = {
            ...message,
            id: (message as any).id || Date.now().toString(),
          };
          setMessages(prev => {
            let initialMessageWithId = null;

            if (message.source === 'ai') {
              setShowUserListening(true);
            } else {
              setShowUserListening(false);
            }

            if (!prev?.length && text) {
              (conversationRef?.current as any)?.connection?.sendMessage({
                type: 'user_message',
                text,
              });
              initialMessageWithId = {
                message: text,
                source: 'user' as const,
                id: Date.now().toString() + 2,
              };
              setShowUserListening(false);
            }

            conversationRef?.current.setVolume({ volume: 0.5 });

            let result = [...prev, messageWithId];

            if (initialMessageWithId) {
              result = [...result, initialMessageWithId];
            }

            return result;
          });
        },
        onDisconnect: () => {
          console.log('DISCONNECTED');

          setMessages(prev => [
            ...prev,
            { message: 'Session Ended', source: 'ai' as const, id: '0' },
          ]);
          setShowUserListening(false);
        },
        clientTools: {
          logMessage: ({ message }) => {
            alert(message);
          },
        },
      });

      if (text) {
        conversation.setVolume({ volume: 0 });
      }

      conversationRef.current = conversation;
    } catch (error) {
      console.log('initiate - error', error);
    }
  }, [text]);

  useEffect(() => {
    initiate();

    return () => {
      (conversationRef?.current as any)?.handleEndSession?.();
    };
  }, [initiate]);

  const { status, mode } = conversationRef?.current || {};

  useEffect(() => {
    if (status === 'disconnected') {
      setShowUserListening(false);
    }
  }, [status]);

  return (
    <div
      ref={containerRef}
      className="overflow-hidden text-gray-900 transition-all duration-100 h-screen-safe dark:bg-stone-900 dark:text-gray-100"
    >
      <div className="flex flex-col h-full pt-4 mx-auto">
        <div className="px-4">
          <Header canGoBack={true}>
            <>
              {mode !== 'speaking' && (
                <MessageSquareDashed className="w-5 h-5" />
              )}
              {status === 'connecting'
                ? 'Connecting...'
                : status === 'connected'
                  ? mode === 'speaking'
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
          {/* {!messages?.length ? (
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
          ) : null} */}

          {!status && (
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
                      : 'bg-stone-200 dark:bg-stone-900 text-gray-900 dark:text-gray-100'
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

          {status === 'disconnected' && (
            <button
              className="flex items-center justify-center gap-2 px-6 py-2 mx-auto mb-20 transition-all border rounded-full text-stone-200 border-stone-200 w-fit font-euclid active:opacity-50"
              onClick={initiate}
            >
              Start Again <RefreshCcw className="w-4 h-4" />
            </button>
          )}

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

        {/* <div className="w-full h-24 p-4 border-t dark:border-stone-800 dark:bg-stone-900 bg-stone-200 border-stone-100"></div> */}
      </div>
    </div>
  );
}

export default ChatPage;
