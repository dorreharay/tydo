import React from 'react';
import { Download, Loader2, Image, FileImage, FileCode } from 'lucide-react';
import { cn } from '@lib/utils';
import { useAdvancedExportImage } from '@hooks/useAdvancedExportImage';
import type { AdvancedExportOptions, ExportLibrary } from '@hooks/useAdvancedExportImage';

interface AdvancedExportButtonProps {
  elementId: string;
  exportOptions?: Omit<AdvancedExportOptions, 'format'>;
  format?: 'png' | 'jpeg' | 'svg';
  library?: ExportLibrary;
  className?: string;
  variant?: 'default' | 'icon' | 'text';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  showProgress?: boolean;
  onExportStart?: () => void;
  onExportComplete?: () => void;
  onExportError?: (error: Error) => void;
}

const formatIcons = {
  png: FileImage,
  jpeg: Image,
  svg: FileCode,
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-1.5 text-sm',
  lg: 'px-4 py-2 text-base',
};

export const AdvancedExportButton: React.FC<AdvancedExportButtonProps> = ({
  elementId,
  exportOptions = {},
  format = 'png',
  library = 'modern-screenshot',
  className,
  variant = 'default',
  size = 'md',
  children,
  showProgress = true,
  onExportStart,
  onExportComplete,
  onExportError
}) => {
  const { exportImage, isExporting, error, progress } = useAdvancedExportImage();
  const FormatIcon = formatIcons[format];

  const handleExport = async () => {
    try {
      onExportStart?.();
      await exportImage(elementId, {
        ...exportOptions,
        format,
        library
      });
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

  const buttonContent = () => {
    if (isExporting) {
      return (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          {variant !== 'icon' && (
            <span>
              {showProgress && progress > 0 ? `${progress}%` : 'Exporting...'}
            </span>
          )}
        </>
      );
    }

    return (
      <>
        {variant === 'icon' ? (
          <FormatIcon className="w-4 h-4" />
        ) : (
          <>
            <Download className="w-4 h-4" />
            {variant !== 'text' && <FormatIcon className="w-3 h-3" />}
            <span>{children || `Export ${format.toUpperCase()}`}</span>
          </>
        )}
      </>
    );
  };

  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className={cn(
        "export-controls flex items-center gap-2 font-medium",
        "bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600",
        "rounded-md transition-all duration-200",
        "hover:bg-stone-100 dark:hover:bg-stone-700",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500",
        "relative overflow-hidden",
        sizeClasses[size],
        className
      )}
      aria-label={isExporting ? 'Exporting...' : `Export as ${format.toUpperCase()}`}
      title={`Export using ${library}`}
    >
      {showProgress && isExporting && progress > 0 && (
        <div
          className="absolute inset-0 bg-blue-500/10 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      )}
      <div className="relative z-10 flex items-center gap-2">
        {buttonContent()}
      </div>
    </button>
  );
};