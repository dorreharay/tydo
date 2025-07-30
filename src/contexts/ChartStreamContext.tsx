import React, { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { ChartPeriod } from '@hooks/useChartData';

const CHART_STREAM_STORAGE_KEY = 'tydo_chart_stream_data';

export interface ChartDataItem {
  id: string;
  timestamp: number;
  data: Array<{
    name: string;
    value: number;
    date: string;
  }>;
  visualizationType: 'sales' | 'products' | 'customers' | 'general';
  chartPeriod: ChartPeriod;
  title?: string;
}

interface ChartStreamContextType {
  chartDataItems: ChartDataItem[];
  addChartData: (data: Omit<ChartDataItem, 'id' | 'timestamp'>) => void;
  clearChartData: () => void;
  isChartStreamVisible: boolean;
  setChartStreamVisible: (visible: boolean) => void;
}

export const ChartStreamContext = createContext<ChartStreamContextType | undefined>(undefined);

export const ChartStreamProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [chartDataItems, setChartDataItems] = useState<ChartDataItem[]>(() => {
    // Load from local storage on initialization
    try {
      const saved = localStorage.getItem(CHART_STREAM_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading chart data from storage:', error);
      return [];
    }
  });
  const [isChartStreamVisible, setChartStreamVisible] = useState(false);

  // Save to local storage whenever chartDataItems changes
  useEffect(() => {
    try {
      localStorage.setItem(CHART_STREAM_STORAGE_KEY, JSON.stringify(chartDataItems));
    } catch (error) {
      console.error('Error saving chart data to storage:', error);
    }
  }, [chartDataItems]);

  const addChartData = (data: Omit<ChartDataItem, 'id' | 'timestamp'>) => {
    const newItem: ChartDataItem = {
      ...data,
      id: Date.now().toString(),
      timestamp: Date.now(),
    };
    setChartDataItems(prev => [...prev, newItem]);
  };

  const clearChartData = () => {
    setChartDataItems([]);
    try {
      localStorage.removeItem(CHART_STREAM_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing chart data from storage:', error);
    }
  };

  return (
    <ChartStreamContext.Provider
      value={{
        chartDataItems,
        addChartData,
        clearChartData,
        isChartStreamVisible,
        setChartStreamVisible,
      }}
    >
      {children}
    </ChartStreamContext.Provider>
  );
};

