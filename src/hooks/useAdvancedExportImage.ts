import { useState, useCallback } from 'react';
import domtoimage from 'dom-to-image-more';
import { domToPng, domToJpeg, domToSvg } from 'modern-screenshot';

export type ExportLibrary = 'dom-to-image-more' | 'modern-screenshot';

export interface AdvancedExportOptions {
  fileName?: string;
  scale?: number;
  backgroundColor?: string;
  quality?: number;
  format?: 'png' | 'jpeg' | 'svg';
  library?: ExportLibrary;
  filter?: (node: Node) => boolean;
  // Additional options for fine-tuning
  includeStyleSheets?: boolean;
  cacheBust?: boolean;
  pixelRatio?: number;
}

export interface UseAdvancedExportImageReturn {
  exportImage: (elementId: string, options?: AdvancedExportOptions) => Promise<void>;
  isExporting: boolean;
  error: Error | null;
  progress: number;
}

export const useAdvancedExportImage = (): UseAdvancedExportImageReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const downloadBlob = useCallback((blob: Blob, fileName: string, format: string) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.${format}`;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, []);

  const exportWithDomToImageMore = useCallback(async (
    element: HTMLElement,
    options: AdvancedExportOptions
  ): Promise<Blob> => {
    const {
      scale = 2,
      backgroundColor = '#ffffff',
      quality = 0.95,
      format = 'png',
      filter,
      cacheBust = true
    } = options;

    setProgress(30);

    const rect = element.getBoundingClientRect();
    const domToImageOptions = {
      width: rect.width * scale,
      height: rect.height * scale,
      bgcolor: backgroundColor,
      quality,
      cacheBust,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${rect.width}px`,
        height: `${rect.height}px`
      },
      filter: filter || ((node: HTMLElement) => {
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

    setProgress(50);

    let dataUrl: string;
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

    setProgress(80);

    const response = await fetch(dataUrl);
    return await response.blob();
  }, []);

  const exportWithModernScreenshot = useCallback(async (
    element: HTMLElement,
    options: AdvancedExportOptions
  ): Promise<Blob> => {
    const {
      scale = 2,
      backgroundColor = '#ffffff',
      quality = 0.95,
      format = 'png',
      filter,
      includeStyleSheets = true,
      pixelRatio = window.devicePixelRatio || 1
    } = options;

    setProgress(30);

    const modernScreenshotOptions = {
      scale: scale * pixelRatio,
      backgroundColor,
      quality,
      style: {
        'background-color': backgroundColor,
      },
      filter: filter || ((node: Node) => {
        if (node instanceof HTMLElement && node.classList) {
          return !(
            node.classList.contains('export-controls') ||
            node.classList.contains('no-export') ||
            node.tagName === 'BUTTON'
          );
        }
        return true;
      }),
      includeStyleSheets,
    };

    setProgress(50);

    let dataUrl: string;
    switch (format) {
      case 'jpeg':
        dataUrl = await domToJpeg(element, modernScreenshotOptions);
        break;
      case 'svg':
        dataUrl = await domToSvg(element, modernScreenshotOptions);
        break;
      case 'png':
      default:
        dataUrl = await domToPng(element, modernScreenshotOptions);
        break;
    }

    setProgress(80);
    
    // Convert data URL to blob
    const response = await fetch(dataUrl);
    return await response.blob();
  }, []);

  const exportImage = useCallback(async (
    elementId: string,
    options: AdvancedExportOptions = {}
  ): Promise<void> => {
    const {
      fileName = `export-${Date.now()}`,
      format = 'png',
      library = 'modern-screenshot'
    } = options;

    setIsExporting(true);
    setError(null);
    setProgress(0);

    try {
      const element = document.getElementById(elementId);
      if (!element) {
        throw new Error(`Element with ID "${elementId}" not found`);
      }

      setProgress(10);

      // Wait for any animations to complete
      await new Promise(resolve => setTimeout(resolve, 300));

      setProgress(20);

      let blob: Blob;
      if (library === 'dom-to-image-more') {
        blob = await exportWithDomToImageMore(element as HTMLElement, options);
      } else {
        blob = await exportWithModernScreenshot(element as HTMLElement, options);
      }

      setProgress(90);

      // Download the image
      downloadBlob(blob, fileName, format);

      setProgress(100);

      // Reset progress after a short delay
      setTimeout(() => setProgress(0), 500);

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Export failed');
      setError(error);
      console.error('Export error:', error);
      throw error;
    } finally {
      setIsExporting(false);
    }
  }, [exportWithDomToImageMore, exportWithModernScreenshot, downloadBlob]);

  return {
    exportImage,
    isExporting,
    error,
    progress
  };
};