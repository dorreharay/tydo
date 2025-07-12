import { useState, useCallback } from 'react';
import domtoimage from 'dom-to-image-more';

export interface ExportOptions {
  fileName?: string;
  scale?: number;
  backgroundColor?: string;
  quality?: number;
  format?: 'png' | 'jpeg' | 'svg';
  filter?: (node: HTMLElement) => boolean;
}

export interface UseExportImageReturn {
  exportImage: (elementId: string, options?: ExportOptions) => Promise<void>;
  isExporting: boolean;
  error: Error | null;
}

export const useExportImage = (): UseExportImageReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const exportImage = useCallback(async (
    elementId: string,
    options: ExportOptions = {}
  ): Promise<void> => {
    const {
      fileName = `export-${Date.now()}`,
      scale = 2,
      backgroundColor = '#ffffff',
      quality = 0.95,
      format = 'png',
      filter
    } = options;

    setIsExporting(true);
    setError(null);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }

      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      // Calculate dimensions with scale
      const rect = element.getBoundingClientRect();
      const width = rect.width * scale;
      const height = rect.height * scale;

      // Configure dom-to-image options
      const domToImageOptions = {
        width,
        height,
        bgcolor: backgroundColor,
        quality,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: `${rect.width}px`,
          height: `${rect.height}px`
        },
        filter: filter || ((node: HTMLElement) => {
          // Default filter: exclude buttons and export controls
          if (node.classList) {
            return !(
              node.classList.contains('export-controls') ||
              node.classList.contains('no-export') ||
              node.tagName === 'BUTTON'
            );
          }
          return true;
        })
      };

      let dataUrl: string;
      
      // Generate image based on format
      switch (format) {
        case 'jpeg':
          dataUrl = await domtoimage.toJpeg(element, domToImageOptions);
          break;
        case 'svg':
          dataUrl = await domtoimage.toSvg(element, domToImageOptions);
          break;
        case 'png':
        default:
          dataUrl = await domtoimage.toPng(element, domToImageOptions);
          break;
      }

      // Convert data URL to blob for download
      const response = await fetch(dataUrl);
      const blob = await response.blob();

      // Download the image
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}.${format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Export failed');
      setError(error);
      console.error('Export error:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, []);

  return {
    exportImage,
    isExporting,
    error
  };
};