import React from 'react';
import { Download, Loader2 } from 'lucide-react';
import { cn } from '@lib/utils';
import { useExportImage } from '@hooks/useExportImage';
import type { ExportOptions } from '@hooks/useExportImage';

interface ExportButtonProps {
  elementId: string;
  exportOptions?: ExportOptions;
  className?: string;
  children?: React.ReactNode;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

export const ExportButton: React.FC<ExportButtonProps> = ({
  elementId,
  exportOptions,
  className,
  children = 'Export Image',
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const { exportImage, isExporting, error } = useExportImage();

  const handleExport = async () => {
    try {
      onExportStart?.();
      await exportImage(elementId, exportOptions);
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
      disabled={isExporting}
      className={cn(
        "export-controls flex items-center gap-2 px-3 py-1.5 text-sm font-medium",
        "bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600",
        "rounded-md transition-all duration-200",
        "hover:bg-stone-100 dark:hover:bg-stone-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        className
      )}
      aria-label={isExporting ? 'Exporting...' : 'Export as image'}
    >
      {isExporting ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Exporting...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          <span>{children}</span>
        </>
      )}
    </button>
  );
};