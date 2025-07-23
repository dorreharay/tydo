import React from 'react';
import { SalesDataVisualization } from './SalesDataVisualization';
import { ShareMenu } from './ShareMenu';
import { ShareableMessage } from './ShareableMessage';
import { useChartData } from '@hooks/useChartData';
import type { ChartPeriod } from '@hooks/useChartData';

interface MessageChartProps {
  messageId?: string;
  messageContent: string;
  messageTimestamp?: Date;
  chartPeriod?: ChartPeriod;
  visualizationType?: 'sales' | 'products' | 'customers' | 'general';
  chartData?: Array<{
    name: string;
    value: number;
    date: string;
  }>;
}

export const MessageChart: React.FC<MessageChartProps> = ({
  messageId = Date.now().toString(),
  messageContent,
  messageTimestamp = new Date(),
  chartPeriod = 'week',
  visualizationType = 'general',
  chartData: customChartData,
}) => {
  const mockChartData = useChartData(chartPeriod);

  const getShareText = () => {
    const periodText =
      chartPeriod === 'quarter'
        ? 'quarterly'
        : chartPeriod === 'month'
          ? 'monthly'
          : 'weekly';
    const typeText =
      visualizationType === 'sales'
        ? 'sales performance'
        : visualizationType === 'products'
          ? 'product analytics'
          : visualizationType === 'customers'
            ? 'customer insights'
            : 'business metrics';

    return `Check out these ${periodText} ${typeText}!`;
  };

  // Format chart data for Excel export
  const excelData = customChartData 
    ? customChartData.map(item => ({
        Date: item.date,
        Name: item.name,
        Value: item.value,
      }))
    : mockChartData.map(item => ({
        Date: item.date,
        Revenue: item.revenue,
        'Units Sold': item.units,
        Customers: item.customers,
        'Average Order Value': item.avgOrderValue || 0,
        'New Customers': item.newCustomers || 0,
        'Returning Customers': item.returningCustomers || 0,
        Products: item.products || 0,
        Returns: item.returns || 0,
      }));

  return (
    <div className="border-none">
      {/* Hidden shareable content for export */}
      <div className="hidden border-none">
        <ShareableMessage
          messageId={messageId}
          content={messageContent}
          timestamp={messageTimestamp}
        >
          <SalesDataVisualization
            showTable={false}
            defaultPeriod={chartPeriod}
            visualizationType={visualizationType}
            customData={customChartData}
          />
        </ShareableMessage>
      </div>

      {/* Visible content */}
      <div className="mt-3 sm:mt-4 space-y-2 border-none">
        <SalesDataVisualization
          showTable={true}
          defaultPeriod={chartPeriod}
          visualizationType={visualizationType}
          customData={customChartData}
        />

        <ShareMenu
          elementId={`shareable-message-${messageId}`}
          title={`${visualizationType.charAt(0).toUpperCase() + visualizationType.slice(1)} Analytics`}
          text={getShareText()}
          hashtags={['analytics', 'data', visualizationType]}
          className="no-export"
          chartData={excelData}
        />
      </div>
    </div>
  );
};
