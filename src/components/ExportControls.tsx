import React from 'react';
import { ExportButton } from './ExportButton';
import { CSVExportButton } from './CSVExportButton';
import type { ExportOptions } from '@hooks/useExportImage';
import type { CSVExportOptions } from '@hooks/useExportCSV';

interface ExportControlsProps {
  elementId: string;
  csvData?: CSVExportOptions['data'];
  csvHeaders?: string[];
  imageOptions?: ExportOptions;
  fileNamePrefix?: string;
  className?: string;
  showImage?: boolean;
  showCSV?: boolean;
  onExportError?: (error: Error) => void;
}

export const ExportControls: React.FC<ExportControlsProps> = ({
  elementId,
  csvData,
  csvHeaders,
  imageOptions,
  fileNamePrefix = 'chart',
  className = '',
  showImage = true,
  showCSV = true,
  onExportError
}) => {
  const timestamp = Date.now();
  
  const handleError = (error: Error) => {
    console.error('Export error:', error);
    onExportError?.(error);
  };

  return (
    <div className={`flex gap-2 ${className}`}>
      {showImage && (
        <ExportButton
          elementId={elementId}
          exportOptions={{
            fileName: `${fileNamePrefix}-${timestamp}`,
            ...imageOptions
          }}
          onExportError={handleError}
        />
      )}
      
      {showCSV && csvData && (
        <CSVExportButton
          data={csvData}
          headers={csvHeaders}
          fileName={`${fileNamePrefix}-data-${timestamp}`}
          onExportError={handleError}
        />
      )}
    </div>
  );
};