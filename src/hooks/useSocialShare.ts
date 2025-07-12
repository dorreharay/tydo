import { useState, useCallback } from 'react';
import domtoimage from 'dom-to-image-more';

export type SocialPlatform = 
  | 'share' // Native Web Share API
  | 'download'
  | 'excel';

interface ShareOptions {
  title?: string;
  text?: string;
  hashtags?: string[];
  chartData?: any[]; // For Excel export
}


export interface UseSocialShareReturn {
  share: (elementId: string, platform: SocialPlatform, options?: ShareOptions) => Promise<void>;
  isSharing: boolean;
  error: Error | null;
  uploadProgress: number;
}

export const useSocialShare = (): UseSocialShareReturn => {
  const [isSharing, setIsSharing] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const generateImage = useCallback(async (elementId: string): Promise<Blob> => {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error(`Element with ID "${elementId}" not found`);
    }

    // Temporarily show the hidden element
    const wasHidden = element.parentElement?.classList.contains('hidden');
    if (wasHidden) {
      element.parentElement!.classList.remove('hidden');
      element.parentElement!.style.position = 'absolute';
      element.parentElement!.style.left = '-9999px';
      element.parentElement!.style.top = '0';
    }

    // Wait for content to render
    await new Promise(resolve => setTimeout(resolve, 500));

    try {
      // Generate image with high quality settings
      const dataUrl = await domtoimage.toPng(element, {
        width: element.scrollWidth,
        height: element.scrollHeight,
        style: {
          margin: '0',
          transform: 'scale(1)',
          transformOrigin: 'top left',
        },
        quality: 1,
        filter: (node: HTMLElement) => {
          // Filter out buttons and controls
          if (node.classList) {
            return !(
              node.classList.contains('export-controls') ||
              node.classList.contains('no-export') ||
              node.tagName === 'BUTTON'
            );
          }
          return true;
        }
      });

      // Convert to blob
      const response = await fetch(dataUrl);
      return await response.blob();
    } finally {
      // Restore hidden state
      if (wasHidden && element.parentElement) {
        element.parentElement.classList.add('hidden');
        element.parentElement.style.position = '';
        element.parentElement.style.left = '';
        element.parentElement.style.top = '';
      }
    }
  }, []);

  const prepareImageBlob = useCallback(async (blob: Blob): Promise<File> => {
    // Convert blob to file for attachment
    setUploadProgress(50);
    
    const file = new File([blob], `tydo-analytics-${Date.now()}.png`, {
      type: 'image/png'
    });
    
    setUploadProgress(100);
    
    return file;
  }, []);

  const share = useCallback(async (
    elementId: string,
    platform: SocialPlatform,
    options: ShareOptions = {}
  ): Promise<void> => {
    setIsSharing(true);
    setError(null);
    setUploadProgress(0);

    try {
      
      if (platform === 'excel') {
        // Special handling for Excel export
        if (options.chartData) {
          const XLSX = await import('xlsx');
          
          // Create a new workbook
          const wb = XLSX.utils.book_new();
          
          // Convert data to worksheet
          const ws = XLSX.utils.json_to_sheet(options.chartData);
          
          // Auto-size columns
          const maxWidths: { [key: string]: number } = {};
          
          // Calculate max width for each column
          options.chartData.forEach((row: any) => {
            Object.keys(row).forEach(key => {
              const value = String(row[key] || '');
              maxWidths[key] = Math.max(maxWidths[key] || 10, value.length + 2);
            });
          });
          
          // Set column widths
          ws['!cols'] = Object.keys(maxWidths).map(key => ({ wch: Math.min(maxWidths[key], 50) }));
          
          // Add worksheet to workbook
          XLSX.utils.book_append_sheet(wb, ws, 'Analytics Data');
          
          // Generate Excel file
          const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
          
          // Create blob and download
          const blob = new Blob([excelBuffer], { 
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
          });
          
          // Create download link
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `tydo-analytics-${Date.now()}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        }
        return;
      }

      if (platform === 'download') {
        // Special handling for download
        const blob = await generateImage(elementId);
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `chart-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        return;
      }


      // For native share, use Web Share API
      if (platform === 'share') {
        // Check if Web Share API is available
        if (!navigator.share) {
          throw new Error('Sharing is not supported on this device');
        }
        
        const blob = await generateImage(elementId);
        const file = await prepareImageBlob(blob);
        
        // Check if the browser supports sharing files
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          try {
            await navigator.share({
              title: options.title || 'Tydo Analytics',
              text: options.text || 'Check out these analytics',
              files: [file]
            });
          } catch (err) {
            // User cancelled the share
            if ((err as Error).name !== 'AbortError') {
              throw err;
            }
          }
        } else {
          // Fallback to URL sharing
          const url = URL.createObjectURL(blob);
          try {
            await navigator.share({
              title: options.title || 'Tydo Analytics',
              text: options.text || 'Check out these analytics',
              url: url
            });
          } finally {
            URL.revokeObjectURL(url);
          }
        }
        
        return;
      }

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Share failed');
      setError(error);
      console.error('Share error:', error);
      throw error;
    } finally {
      setIsSharing(false);
      setTimeout(() => setUploadProgress(0), 500);
    }
  }, [generateImage, prepareImageBlob]);

  return {
    share,
    isSharing,
    error,
    uploadProgress
  };
};