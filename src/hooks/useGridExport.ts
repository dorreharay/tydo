import { useState, useCallback } from 'react';
import domtoimage from 'dom-to-image-more';

export interface GridExportOptions {
  fileName?: string;
  format?: 'png' | 'jpeg';
  quality?: number;
  backgroundColor?: string;
  gridGap?: number;
  columns?: number;
  padding?: number;
  scale?: number;
}

export interface UseGridExportReturn {
  exportGrid: (elementIds: string[], options?: GridExportOptions) => Promise<void>;
  isExporting: boolean;
  error: Error | null;
  progress: number;
}

export const useGridExport = (): UseGridExportReturn => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [progress, setProgress] = useState(0);

  const createGridCanvas = useCallback(async (
    elements: HTMLElement[],
    options: GridExportOptions
  ): Promise<HTMLCanvasElement> => {
    const {
      gridGap = 20,
      columns = 2,
      padding = 40,
      scale = 2,
      backgroundColor = '#1c1917' // stone-900
    } = options;

    // Capture each element
    const canvases: HTMLCanvasElement[] = [];
    for (let i = 0; i < elements.length; i++) {
      setProgress(Math.floor((i / elements.length) * 50));
      
      const canvas = await domtoimage.toCanvas(elements[i], {
        bgcolor: backgroundColor,
        width: elements[i].offsetWidth * scale,
        height: elements[i].offsetHeight * scale,
        style: {
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        },
        filter: (node: HTMLElement) => {
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
      
      canvases.push(canvas);
    }

    if (canvases.length === 0) {
      throw new Error('No elements to export');
    }

    // Calculate grid dimensions
    const rows = Math.ceil(canvases.length / columns);
    const cellWidth = Math.max(...canvases.map(c => c.width));
    const cellHeight = Math.max(...canvases.map(c => c.height));
    
    const totalWidth = (cellWidth * columns) + (gridGap * (columns - 1)) + (padding * 2);
    const totalHeight = (cellHeight * rows) + (gridGap * (rows - 1)) + (padding * 2);

    // Create the grid canvas
    const gridCanvas = document.createElement('canvas');
    gridCanvas.width = totalWidth;
    gridCanvas.height = totalHeight;
    const ctx = gridCanvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Failed to create canvas context');
    }

    // Fill background
    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, totalWidth, totalHeight);

    // Draw each canvas in the grid
    canvases.forEach((canvas, index) => {
      const row = Math.floor(index / columns);
      const col = index % columns;
      
      const x = padding + (col * (cellWidth + gridGap)) + (cellWidth - canvas.width) / 2;
      const y = padding + (row * (cellHeight + gridGap)) + (cellHeight - canvas.height) / 2;
      
      ctx.drawImage(canvas, x, y);
      
      setProgress(50 + Math.floor(((index + 1) / canvases.length) * 40));
    });

    return gridCanvas;
  }, []);

  const exportGrid = useCallback(async (
    elementIds: string[],
    options: GridExportOptions = {}
  ): Promise<void> => {
    const {
      fileName = `chart-grid-${Date.now()}`,
      format = 'png',
      quality = 0.95
    } = options;

    setIsExporting(true);
    setError(null);
    setProgress(0);

    try {
      // Get all elements
      const elements = elementIds
        .map(id => document.getElementById(id))
        .filter((el): el is HTMLElement => el !== null);

      if (elements.length === 0) {
        throw new Error('No valid elements found');
      }

      // Wait for animations
      await new Promise(resolve => setTimeout(resolve, 300));

      // Create grid canvas
      const gridCanvas = await createGridCanvas(elements, options);
      
      setProgress(90);

      // Convert to blob and download
      gridCanvas.toBlob(
        (blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}.${format}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            setProgress(100);
          } else {
            throw new Error('Failed to create image blob');
          }
        },
        `image/${format}`,
        quality
      );

    } catch (err) {
      const error = err instanceof Error ? err : new Error('Export failed');
      setError(error);
      console.error('Grid export error:', error);
      throw error;
    } finally {
      setIsExporting(false);
      setTimeout(() => setProgress(0), 500);
    }
  }, [createGridCanvas]);

  return {
    exportGrid,
    isExporting,
    error,
    progress
  };
};