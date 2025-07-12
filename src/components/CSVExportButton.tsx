import React from 'react';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';
import { useExportCSV } from '@hooks/useExportCSV';
import type { CSVExportOptions } from '@hooks/useExportCSV';

interface CSVExportButtonProps {
  data: CSVExportOptions['data'];
  headers?: string[];
  fileName?: string;
  className?: string;
  children?: React.ReactNode;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export const CSVExportButton: React.FC<CSVExportButtonProps> = ({
  data,
  headers,
  fileName,
  className,
  children = 'Export CSV',
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const { exportCSV, isExporting, error } = useExportCSV();

  const handleExport = () => {
    try {
      onExportStart?.();
      exportCSV({ data, headers, fileName });
      onExportComplete?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Export failed');
      onExportError?.(error);
    }
  };

  React.useEffect(() => {
    if (error && onExportError) {
      onExportError(error);
    }
  }, [error, onExportError]);

  return (
    <button
      onClick={handleExport}
      disabled={isExporting || !data || data.length === 0}
      className={cn(
        "export-controls flex items-center gap-2 px-3 py-1.5 text-sm font-medium",
        "bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600",
        "rounded-md transition-all duration-200",
        "hover:bg-stone-100 dark:hover:bg-stone-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        className
      )}
      aria-label={isExporting ? 'Exporting...' : 'Export as CSV'}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <FileSpreadsheet className="w-4 h-4" />
          <span>{children}</span>
        </>
      )}
    </button>
  );
};