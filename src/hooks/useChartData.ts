import { useMemo } from 'react';

export interface ChartDataPoint {
  date: string;
  revenue: number;
  units: number;
  customers: number;
  products?: number;
  returns?: number;
  avgOrderValue?: number;
  newCustomers?: number;
  returningCustomers?: number;
}

export type ChartPeriod = 'week' | 'month' | 'quarter';

export const useChartData = (period: ChartPeriod): ChartDataPoint[] => {
  return useMemo(() => {
    const now = new Date();
    const data: ChartDataPoint[] = [];
    
    const days = period === 'quarter' ? 90 : period === 'month' ? 30 : 7;
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      
      const baseRevenue = 5000 + Math.random() * 3000;
      const growthFactor = 1 + (0.12 / days) * (days - i);
      
      const units = Math.round(40 + Math.random() * 30);
      const customers = Math.round(20 + Math.random() * 15);
      
      data.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: Math.round(baseRevenue * growthFactor),
        units,
        customers,
        products: Math.round(15 + Math.random() * 10),
        returns: Math.round(2 + Math.random() * 5),
        avgOrderValue: Math.round((baseRevenue * growthFactor) / units),
        newCustomers: Math.round(customers * 0.3),
        returningCustomers: Math.round(customers * 0.7),
      });
    }
    
    return data;
  }, [period]);
};