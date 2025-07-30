import { useContext } from 'react';
import { ChartStreamContext } from '@/contexts/ChartStreamContext';

export const useChartStream = () => {
  const context = useContext(ChartStreamContext);
  if (context === undefined) {
    throw new Error('useChartStream must be used within a ChartStreamProvider');
  }
  return context;
};