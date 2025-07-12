import React, { useState, useRef, useEffect } from 'react';
import { 
  Download, 
  FileSpreadsheet, 
  Image as ImageIcon, 
  Grid3x3, 
  Check,
  Loader2,
} from 'lucide-react';
import { cn } from '@lib/utils';
import { useAdvancedExportImage } from '@hooks/useAdvancedExportImage';
import { useExportCSV } from '@hooks/useExportCSV';
import { useGridExport } from '@hooks/useGridExport';
import type { CSVExportOptions } from '@hooks/useExportCSV';

interface ExportMenuV2Props {
  elementId: string;
  allChartIds?: string[]; // For grid export
  csvData?: CSVExportOptions['data'];
  csvHeaders?: string[];
  fileNamePrefix?: string;
  className?: string;
  onExportError?: (error: Error) => void;
}

type ExportType = 'single-image' | 'grid-image' | 'csv';

const exportTypeConfig = {
  'single-image': {
    icon: ImageIcon,
    label: 'Export as Image',
    description: 'Download current chart as PNG'
  },
  'grid-image': {
    icon: Grid3x3,
    label: 'Export All Charts',
    description: 'Download all charts in a grid layout'
  },
  'csv': {
    icon: FileSpreadsheet,
    label: 'Export as CSV',
    description: 'Download data in spreadsheet format'
  }
};

export const ExportMenuV2: React.FC<ExportMenuV2Props> = ({
  elementId,
  allChartIds = [],
  csvData,
  csvHeaders,
  fileNamePrefix = 'export',
  className,
  onExportError
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<ExportType>('single-image');
  const [exportSuccess, setExportSuccess] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  
  const { exportImage, isExporting: isImageExporting } = useAdvancedExportImage();
  const { exportCSV, isExporting: isCSVExporting } = useExportCSV();
  const { exportGrid, isExporting: isGridExporting, progress: gridProgress } = useGridExport();
  
  const isExporting = isImageExporting || isCSVExporting || isGridExporting;
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleExport = async () => {
    try {
      setExportSuccess(false);
      
      switch (selectedType) {
        case 'single-image':
          await exportImage(elementId, {
            fileName: `${fileNamePrefix}-${timestamp}`,
            format: 'png',
            scale: 2,
            backgroundColor: '#1c1917',
            library: 'modern-screenshot'
          });
          break;
          
        case 'grid-image':
          if (allChartIds.length > 0) {
            await exportGrid(allChartIds, {
              fileName: `${fileNamePrefix}-grid-${timestamp}`,
              format: 'png',
              columns: allChartIds.length > 2 ? 2 : 1,
              backgroundColor: '#1c1917',
              gridGap: 24,
              padding: 48
            });
          }
          break;
          
        case 'csv':
          if (csvData) {
            exportCSV({
              data: csvData,
              headers: csvHeaders,
              fileName: `${fileNamePrefix}-data-${timestamp}`
            });
          }
          break;
      }
      
      setExportSuccess(true);
      setTimeout(() => {
        setExportSuccess(false);
        setIsOpen(false);
      }, 1500);
      
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Export failed');
      onExportError?.(err);
    }
  };

  const availableTypes: ExportType[] = ['single-image'];
  if (allChartIds.length > 1) availableTypes.push('grid-image');
  if (csvData) availableTypes.push('csv');

  return (
    <div ref={menuRef} className={cn("relative", className)}>
      {/* Main Export Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isExporting}
        className={cn(
          "export-controls flex items-center gap-2.5 px-5 py-2.5",
          "bg-stone-800 hover:bg-stone-700 active:bg-stone-900",
          "text-stone-100 font-medium text-sm",
          "border border-stone-700 hover:border-stone-600",
          "rounded-xl transition-all duration-200 ease-out",
          "shadow-lg hover:shadow-xl",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 focus:ring-offset-stone-900",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          "group relative overflow-hidden"
        )}
      >
        {/* Background animation on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-stone-700 to-stone-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Button content */}
        <div className="relative flex items-center gap-2.5">
          {isExporting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : exportSuccess ? (
            <Check className="w-4 h-4 text-green-400 animate-in zoom-in duration-200" />
          ) : (
            <Download className="w-4 h-4 transition-transform group-hover:scale-110 group-active:scale-95" />
          )}
          <span>{isExporting ? 'Exporting...' : exportSuccess ? 'Exported!' : 'Export'}</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && !isExporting && (
        <div className={cn(
          "absolute right-0 mt-2 w-72 z-50",
          "bg-stone-900 border border-stone-800",
          "rounded-xl shadow-2xl",
          "animate-in fade-in slide-in-from-top-2 duration-200"
        )}>
          {/* Export type selection */}
          <div className="p-4 space-y-3">
            <h3 className="text-sm font-semibold text-stone-100 mb-3">
              Choose export format
            </h3>
            
            {availableTypes.map((type) => {
              const config = exportTypeConfig[type];
              const Icon = config.icon;
              
              return (
                <button
                  key={type}
                  onClick={() => setSelectedType(type)}
                  className={cn(
                    "w-full flex items-start gap-3 p-3 rounded-lg",
                    "transition-all duration-200",
                    "group hover:bg-stone-800",
                    selectedType === type && "bg-stone-800 ring-2 ring-stone-700"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    selectedType === type 
                      ? "bg-stone-700 text-stone-100" 
                      : "bg-stone-800 text-stone-400 group-hover:bg-stone-700 group-hover:text-stone-200"
                  )}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-sm font-medium text-stone-100">
                      {config.label}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {config.description}
                    </p>
                  </div>
                  {selectedType === type && (
                    <Check className="w-4 h-4 text-stone-400 mt-3" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Progress indicator for grid export */}
          {isGridExporting && gridProgress > 0 && (
            <div className="px-4 pb-3">
              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-stone-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${gridProgress}%` }}
                />
              </div>
              <p className="text-xs text-stone-400 mt-1 text-center">
                Processing... {gridProgress}%
              </p>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex gap-2 p-4 pt-0">
            <button
              onClick={() => setIsOpen(false)}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium",
                "text-stone-400 hover:text-stone-200",
                "border border-stone-800 hover:border-stone-700",
                "rounded-lg transition-all duration-200",
                "hover:bg-stone-800"
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleExport}
              disabled={isExporting}
              className={cn(
                "flex-1 px-4 py-2 text-sm font-medium",
                "bg-stone-700 hover:bg-stone-600 text-stone-100",
                "rounded-lg transition-all duration-200",
                "shadow-md hover:shadow-lg",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};