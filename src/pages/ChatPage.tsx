import { useState, useEffect, useRef } from 'react';
import { MessageSquareDashed, Send } from 'lucide-react';
import { cn } from '@lib/utils';
import Header from '@/components/Header';
import dayjs from 'dayjs';
import { SalesDataVisualization } from '@components/SalesDataVisualization';

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  showChart?: boolean;
  chartPeriod?: 'week' | 'month' | 'quarter';
  visualizationType?: 'sales' | 'products' | 'customers' | 'general';
}

function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Welcome to Tydo Chat! How can I help you today?',
      role: 'assistant',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Prevent default scrolling behavior on input focus
    const handleFocus = (e: FocusEvent) => {
      if (e.target === inputRef.current) {
        e.preventDefault();
        // Keep the view fixed
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

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      role: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const userQuery = inputValue.toLowerCase();
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const isSalesQuery = userQuery.includes('sales') || 
                          userQuery.includes('revenue') || 
                          userQuery.includes('business') ||
                          userQuery.includes('performance') ||
                          userQuery.includes('results');
      
      const isProductQuery = userQuery.includes('product') || 
                            userQuery.includes('inventory') || 
                            userQuery.includes('stock');
      
      const isCustomerQuery = userQuery.includes('customer') || 
                             userQuery.includes('client') || 
                             userQuery.includes('user');
      
      let period: 'week' | 'month' | 'quarter' = 'week';
      if (userQuery.includes('month')) period = 'month';
      if (userQuery.includes('quarter')) period = 'quarter';
      
      let content = '';
      let showChart = false;
      let visualizationType: 'sales' | 'products' | 'customers' | 'general' = 'general';
      
      if (isSalesQuery) {
        content = `Here's your sales data analysis for the last ${period}. The charts show revenue trends and detailed performance metrics.`;
        showChart = true;
        visualizationType = 'sales';
      } else if (isProductQuery) {
        content = `I understand you're asking about products. Here's the product performance data for the last ${period}.`;
        showChart = true;
        visualizationType = 'products';
      } else if (isCustomerQuery) {
        content = `I understand you're asking about customers. Here's the customer analytics for the last ${period}.`;
        showChart = true;
        visualizationType = 'customers';
      } else {
        content = `I understand you're asking about "${userQuery}". Here's what I found for you.`;
        showChart = true; // Always show charts after "I understand you're asking about"
        visualizationType = 'general';
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content,
        role: 'assistant',
        timestamp: new Date(),
        showChart,
        chartPeriod: period,
        visualizationType,
      };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
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
      <div className="flex flex-col h-full pt-8 mx-auto">
        <div className="px-4">
          <Header canGoBack={true}>
            <>
              <MessageSquareDashed className="w-5 h-5" />
              Chat with Tydo
            </>
          </Header>
        </div>

        <div className="flex flex-col flex-1 gap-4 p-4 mt-6 overflow-y-auto bg-stone-100 dark:bg-stone-800 rounded-t-3xl -webkit-overflow-scrolling-touch overscroll-none">
          {messages.map(message => (
            <div key={message.id} className="space-y-2">
              <div
                className={cn(
                  'flex',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'flex flex-col max-w-[80%] p-3 rounded-2xl',
                    message.role === 'user'
                      ? 'bg-rose-800 text-white'
                      : 'bg-stone-100 dark:bg-stone-900 text-gray-900 dark:text-gray-100'
                  )}
                >
                  <p className="text-left text-md font-euclid">
                    {message.content}
                  </p>
                  <p
                    className={cn(
                      'text-xs text-right',
                      message.role === 'user'
                        ? 'text-rose-100'
                        : 'text-gray-500 dark:text-gray-400'
                    )}
                  >
                    {dayjs(message.timestamp).format('HH:mm')}
                  </p>
                </div>
              </div>
              {message.showChart && message.role === 'assistant' && (
                <div className="mt-4 animate-fade-in animate-duration-500">
                  <SalesDataVisualization 
                    showTable={true} 
                    defaultPeriod={message.chartPeriod || 'week'}
                    visualizationType={message.visualizationType || 'general'}
                  />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-2xl">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-full p-4 border-t dark:border-stone-800 dark:bg-stone-900 bg-stone-200 border-stone-100">
          <div className="flex gap-2">
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
              disabled={!inputValue.trim() || isLoading}
              className={cn(
                'p-3 rounded-full transition-colors',
                inputValue.trim() && !isLoading
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
