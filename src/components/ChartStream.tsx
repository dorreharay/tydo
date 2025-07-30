import React, { useEffect } from 'react';
import { X, BarChart2, Trash2 } from 'lucide-react';
import { useChartStream } from '@/hooks/useChartStream';
import { MessageChart } from './MessageChart';
import { cn } from '@lib/utils';

export const ChartStream: React.FC = () => {
  const { chartDataItems, clearChartData, isChartStreamVisible, setChartStreamVisible } = useChartStream();

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isChartStreamVisible) {
        setChartStreamVisible(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isChartStreamVisible, setChartStreamVisible]);

  if (!isChartStreamVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
      {/* Semi-transparent backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={() => setChartStreamVisible(false)}
      />
      
      {/* Chart content */}
      <div className="relative w-full max-w-6xl h-[90vh] bg-white dark:bg-stone-900 rounded-xl shadow-2xl overflow-hidden flex flex-col animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center justify-between p-4 border-b dark:border-stone-700 bg-stone-50 dark:bg-stone-800">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-rose-800 dark:text-rose-400" />
            <h2 className="text-lg font-euclid-m">Chart Stream</h2>
            <span className="text-sm text-stone-500">({chartDataItems.length} charts)</span>
          </div>
          <div className="flex items-center gap-2">
            {chartDataItems.length > 0 && (
              <button
                onClick={clearChartData}
                className="p-2 text-stone-600 hover:text-red-600 dark:text-stone-400 dark:hover:text-red-400 transition-colors rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700"
                title="Clear all charts"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={() => setChartStreamVisible(false)}
              className="p-2 text-stone-600 hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100 transition-colors rounded-lg hover:bg-stone-100 dark:hover:bg-stone-700"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chartDataItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-stone-500">
              <BarChart2 className="w-12 h-12 mb-3 opacity-50" />
              <p className="text-lg font-euclid">No charts yet</p>
              <p className="text-sm mt-1">Charts will appear here when generated</p>
            </div>
          ) : (
            chartDataItems.map((item) => (
              <div key={item.id} className={cn(
                "border rounded-lg p-4 dark:border-stone-700",
                "animate-in fade-in-0 slide-in-from-bottom-2 duration-300"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-euclid-m text-stone-600 dark:text-stone-400">
                    {item.title || `Chart ${new Date(item.timestamp).toLocaleTimeString()}`}
                  </h3>
                  <span className="text-xs text-stone-500">
                    {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                </div>
                <MessageChart
                  messageId={item.id}
                  messageContent=""
                  chartPeriod={item.chartPeriod}
                  visualizationType={item.visualizationType}
                  chartData={item.data}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};