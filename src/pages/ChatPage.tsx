import { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquareDashed,
  LoaderCircle,
  RefreshCcw,
  Send,
} from 'lucide-react';
import Header from '@/components/Header';
import type { ChartPeriod } from '@hooks/useChartData';
import { MessageChart } from '@/components/MessageChart';
import { useNavigation } from '@/contexts/NavigationContext';
import { useConversation } from '@/hooks/useConversation';
import { ChatMessage } from '@/components/ChatMessage';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useScrollToBottom } from '@/hooks/useScrollToBottom';
import { usePreventScrollOnFocus } from '@/hooks/usePreventScrollOnFocus';

interface ChartData {
  name: string;
  value: number;
  date: string;
}

interface Message {
  id: string;
  message: string;
  source: 'user' | 'ai';
  showChart?: boolean;
  chartPeriod?: ChartPeriod;
  visualizationType?: 'sales' | 'products' | 'customers' | 'general';
  chartData?: ChartData[];
}

const INITIAL_MESSAGE_DELAY = 2000;
const CHART_DISPLAY_DELAY = 3000;
const SCROLL_DELAY = 100;
const DEFAULT_VOLUME = 0.5;

function ChatPage() {
  const { initialMessage, setInitialMessage } = useNavigation();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const [showUserListening, setShowUserListening] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useScrollToBottom([messages], SCROLL_DELAY);

  usePreventScrollOnFocus(inputRef, containerRef);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);


  const handleMessage = useCallback(
    (message: any) => {
      const messageWithId: Message = {
        ...message,
        id: message.id || Date.now().toString(),
      };
      
      setMessages(prev => {
        let initialMessageWithId: Message | null = null;

        setShowUserListening(message.source === 'ai');

        if (!prev?.length && initialMessage) {
          setTimeout(() => {
            sendMessage(initialMessage);
            setInitialMessage(null);
          }, INITIAL_MESSAGE_DELAY);
          
          setShowUserListening(false);
          initialMessageWithId = {
            message: initialMessage,
            source: 'user',
            id: `${Date.now()}-initial`,
          };
        }

        let result = [...prev, messageWithId];
        if (initialMessageWithId) {
          result = [...result, initialMessageWithId];
        }

        return result;
      });
    },
    [initialMessage, setInitialMessage]
  );

  const handleDisconnect = useCallback(() => {
    setMessages(prev => [
      ...prev,
      { 
        message: 'Session Ended', 
        source: 'ai', 
        id: 'disconnected' 
      },
    ]);
    setShowUserListening(false);
  }, []);

  const clientTools = {
    generate_table: ({ data }: { data: ChartData[] }) => {
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: Date.now().toString(),
            message: '',
            source: 'ai',
            showChart: true,
            chartData: data,
            visualizationType: 'general',
            chartPeriod: 'month',
          },
        ]);
      }, CHART_DISPLAY_DELAY);
    },
  };

  const { conversation, status, mode, sendMessage, initiate } = useConversation({
    onMessage: handleMessage,
    onDisconnect: handleDisconnect,
    clientTools,
  });


  useEffect(() => {
    if (status === 'disconnected') {
      setShowUserListening(false);
    }
  }, [status]);

  const handleSendMessage = () => {
    if (!inputValue.trim() || !conversation) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      message: inputValue.trim(),
      source: 'user',
    };

    setMessages(prev => [...prev, newMessage]);
    setInputValue('');
    sendMessage(inputValue.trim());
    setShowUserListening(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
              <ChatMessage message={message.message} source={message.source} />
              {message.showChart && (
                <MessageChart
                  messageId={message.id}
                  messageContent={message.message}
                  chartPeriod={message.chartPeriod}
                  visualizationType={message.visualizationType}
                  chartData={message.chartData}
                />
              )}
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

          {showUserListening && <LoadingIndicator isUser />}

          {status === 'connected' &&
            !showUserListening &&
            messages.length > 0 && <LoadingIndicator />}
        </div>

        <div className="w-full p-4 bg-white border-t dark:border-stone-700 dark:bg-stone-900 border-stone-200">
          <div className="flex items-end max-w-4xl gap-2 mx-auto">
            <textarea
              ref={inputRef}
              value={inputValue}
              onChange={e => setInputValue(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Type a message..."
              className="flex-1 px-4 py-3 text-base bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-full focus:outline-none resize-none min-h-[48px] max-h-[120px] font-euclid overflow-y-auto"
              rows={1}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || status !== 'connected'}
              className="p-3 text-white transition-all duration-200 rounded-full bg-rose-800 hover:bg-rose-700 active:bg-rose-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
