import { useState, useCallback } from 'react';

export interface CSVExportOptions {
  fileName?: string;
  headers?: string[];
  data: Array<Record<string, unknown>>;
}

export interface UseExportCSVReturn {
  exportCSV: (options: CSVExportOptions) => void;
  isExporting: boolean;
  error: Error | null;
}

export const useExportCSV = (): UseExportCSVReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportCSV = useCallback((options: CSVExportOptions): void => {
    const { 
      fileName = `export-${Date.now()}`, 
      headers,
      data 
    } = options;

    setIsExporting(true);
    setError(null);

    try {
      if (!data || data.length === 0) {
        throw new Error('No data to export');
      }

      // Determine headers from data if not provided
      const csvHeaders = headers || Object.keys(data[0]);
      
      // Build CSV content
      let csvContent = csvHeaders.join(',') + '\n';
      
      data.forEach(row => {
        const values = csvHeaders.map(header => {
          const value = row[header];
          // Escape values containing commas or quotes
          if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
            return `"${value.replace(/"/g, '""')}"`;
          }
          return value ?? '';
        });
        csvContent += values.join(',') + '\n';
      });

      // Create and download the file
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('CSV export failed');
      setError(error);
      console.error('CSV export error:', error);
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportCSV,
    isExporting,
    error
  };
};