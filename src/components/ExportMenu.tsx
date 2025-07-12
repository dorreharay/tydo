import React, { useState } from 'react';
import { ChevronDown, Download, FileSpreadsheet, Settings } from 'lucide-react';
import { cn } from '@lib/utils';
import { AdvancedExportButton } from './AdvancedExportButton';
import { CSVExportButton } from './CSVExportButton';
import type { ExportLibrary } from '@hooks/useAdvancedExportImage';
import type { CSVExportOptions } from '@hooks/useExportCSV';

interface ExportMenuProps {
  elementId: string;
  csvData?: CSVExportOptions['data'];
  csvHeaders?: string[];
  fileNamePrefix?: string;
  className?: string;
  defaultFormat?: 'png' | 'jpeg' | 'svg';
  defaultLibrary?: ExportLibrary;
  onExportError?: (error: Error) => void;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({
  elementId,
  csvData,
  csvHeaders,
  fileNamePrefix = 'export',
  className,
  defaultFormat = 'png',
  defaultLibrary = 'modern-screenshot',
  onExportError
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState(defaultFormat);
  const [selectedLibrary, setSelectedLibrary] = useState<ExportLibrary>(defaultLibrary);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const fileName = `${fileNamePrefix}-${timestamp}`;

  const handleExportError = (error: Error) => {
    console.error('Export error:', error);
    onExportError?.(error);
    setIsOpen(false);
  };

  const handleExportComplete = () => {
    setIsOpen(false);
  };

  return (
    <div className={cn("relative", className)}>
      {/* Main Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "export-controls flex items-center gap-2 px-4 py-2 text-sm font-medium",
          "bg-stone-800 hover:bg-stone-700 text-stone-100",
          "border border-stone-700 hover:border-stone-600",
          "rounded-lg transition-all duration-200",
          "shadow-lg hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500",
          "group"
        )}
      >
        <Download className="w-4 h-4 transition-transform group-hover:scale-110" />
        <span>Export</span>
        <ChevronDown className={cn(
          "w-4 h-4 transition-transform duration-200",
          isOpen && "rotate-180"
        )} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Menu Content */}
          <div className={cn(
            "absolute right-0 mt-2 w-80 z-50",
            "bg-white dark:bg-stone-800 rounded-lg shadow-lg",
            "border border-stone-200 dark:border-stone-700",
            "animate-in fade-in slide-in-from-top-2 duration-200"
          )}>
            <div className="p-4 space-y-4">
              {/* Image Export Section */}
              <div>
                <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Export as Image
                </h3>
                
                {/* Format Selection */}
                <div className="flex gap-2 mb-3">
                  {(['png', 'jpeg', 'svg'] as const).map((format) => (
                    <button
                      key={format}
                      onClick={() => setSelectedFormat(format)}
                      className={cn(
                        "px-3 py-1 text-xs rounded-md transition-colors",
                        selectedFormat === format
                          ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                          : "bg-stone-100 dark:bg-stone-700 hover:bg-stone-200 dark:hover:bg-stone-600"
                      )}
                    >
                      {format.toUpperCase()}
                    </button>
                  ))}
                </div>

                {/* Advanced Options Toggle */}
                <button
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mb-2"
                >
                  <Settings className="w-3 h-3" />
                  Advanced Options
                  <ChevronDown className={cn(
                    "w-3 h-3 transition-transform",
                    showAdvanced && "rotate-180"
                  )} />
                </button>

                {/* Advanced Options */}
                {showAdvanced && (
                  <div className="mb-3 p-3 bg-stone-50 dark:bg-stone-900 rounded-md space-y-2">
                    <div>
                      <label className="text-xs text-stone-600 dark:text-stone-400">
                        Export Library:
                      </label>
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => setSelectedLibrary('modern-screenshot')}
                          className={cn(
                            "px-2 py-1 text-xs rounded transition-colors",
                            selectedLibrary === 'modern-screenshot'
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              : "bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600"
                          )}
                        >
                          Modern Screenshot
                        </button>
                        <button
                          onClick={() => setSelectedLibrary('dom-to-image-more')}
                          className={cn(
                            "px-2 py-1 text-xs rounded transition-colors",
                            selectedLibrary === 'dom-to-image-more'
                              ? "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300"
                              : "bg-white dark:bg-stone-800 border border-stone-300 dark:border-stone-600"
                          )}
                        >
                          Dom to Image
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Export Button */}
                <AdvancedExportButton
                  elementId={elementId}
                  format={selectedFormat}
                  library={selectedLibrary}
                  exportOptions={{
                    fileName,
                    scale: 2,
                    quality: 0.95
                  }}
                  className="w-full justify-center"
                  onExportComplete={handleExportComplete}
                  onExportError={handleExportError}
                >
                  Export {selectedFormat.toUpperCase()} Image
                </AdvancedExportButton>
              </div>

              {/* Divider */}
              {csvData && (
                <>
                  <div className="border-t border-stone-200 dark:border-stone-700" />
                  
                  {/* CSV Export Section */}
                  <div>
                    <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                      <FileSpreadsheet className="w-4 h-4" />
                      Export as Data
                    </h3>
                    
                    <CSVExportButton
                      data={csvData}
                      headers={csvHeaders}
                      fileName={fileName}
                      className="w-full justify-center"
                      onExportComplete={handleExportComplete}
                      onExportError={handleExportError}
                    >
                      Export CSV Data
                    </CSVExportButton>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};