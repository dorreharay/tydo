import React, { useState, useRef, useEffect } from 'react';
import {
  Share2,
  Check,
  Loader2,
  FileSpreadsheet,
  Download,
  Share,
} from 'lucide-react';
import { cn } from '@lib/utils';
import { useSocialShare } from '@hooks/useSocialShare';
import type { SocialPlatform } from '@hooks/useSocialShare';

interface ShareMenuProps {
  elementId: string;
  title?: string;
  text?: string;
  hashtags?: string[];
  className?: string;
  chartData?: any[];
}

const platformColors: Record<SocialPlatform, string> = {
  share: 'hover:bg-stone-700/50 hover:text-stone-200',
  download: 'hover:bg-stone-700/50 hover:text-stone-200',
  excel: 'hover:bg-[#107C41]/10 hover:text-[#107C41]',
};

const platformNames: Record<SocialPlatform, string> = {
  share: 'Share to Apps',
  download: 'Download as PNG',
  excel: 'Export to Excel',
};

export const ShareMenu: React.FC<ShareMenuProps> = ({
  elementId,
  title = 'Check out this chart',
  text = 'Generated with Tydo',
  hashtags = ['data', 'analytics'],
  className,
  chartData,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [sharedPlatform, setSharedPlatform] = useState<SocialPlatform | null>(
    null
  );
  const menuRef = useRef<HTMLDivElement>(null);

  const { share, isSharing, uploadProgress } = useSocialShare();

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () =>
        document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const handleShare = async (platform: SocialPlatform) => {
    try {
      await share(elementId, platform, { title, text, hashtags, chartData });

      setSharedPlatform(platform);
      setTimeout(() => {
        setSharedPlatform(null);
        if (platform !== 'excel' && platform !== 'download') {
          setIsOpen(false);
        }
      }, 1500);
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const platforms: SocialPlatform[] = ['share', 'download', 'excel'];

  return (
    <div ref={menuRef} className={cn('relative', className)}>
      {/* Main Share Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isSharing}
        className={cn(
          'export-controls flex items-center gap-2.5 px-5 py-2.5',
          'bg-stone-800 hover:bg-stone-700 active:bg-stone-900',
          'text-stone-100 font-medium text-sm',
          'border border-stone-700 hover:border-stone-600',
          'rounded-xl transition-all duration-200 ease-out',
          'shadow-lg hover:shadow-xl',
          'focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 focus:ring-offset-stone-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'group relative overflow-hidden'
        )}
      >
        {/* Background animation on hover */}
        <div className="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-r from-stone-700 to-stone-600 group-hover:opacity-100" />

        {/* Button content */}
        <div className="relative flex items-center gap-2.5">
          {isSharing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Share2 className="w-4 h-4 transition-transform group-hover:scale-110 group-active:scale-95" />
          )}
          <span>{isSharing ? 'Processing...' : 'Share'}</span>
        </div>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            'absolute right-0 mt-2 w-64 z-50',
            'bg-stone-900 border border-stone-800',
            'rounded-xl shadow-2xl',
            'animate-in fade-in slide-in-from-top-2 duration-200'
          )}
        >
          {/* Upload Progress */}
          {isSharing && uploadProgress > 0 && (
            <div className="p-4 pb-2">
              <div className="flex items-center justify-between mb-2 text-xs text-stone-400">
                <span>Preparing image...</span>
                <span>{uploadProgress}%</span>
              </div>
              <div className="w-full bg-stone-800 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full transition-all duration-300 ease-out bg-stone-600"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="p-4 space-y-2">
            {platforms.map(platform => {
              const isShared = sharedPlatform === platform;

              return (
                <button
                  key={platform}
                  onClick={() => handleShare(platform)}
                  disabled={isSharing}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-lg',
                    'bg-stone-800 text-stone-300',
                    'transition-all duration-200',
                    'hover:bg-stone-700 hover:text-stone-100',
                    'disabled:opacity-50 disabled:cursor-not-allowed',
                    'group',
                    platformColors[platform]
                  )}
                >
                  {platform === 'excel' ? (
                    <FileSpreadsheet className="w-4 h-4" />
                  ) : platform === 'download' ? (
                    <Download className="w-4 h-4" />
                  ) : (
                    <Share className="w-4 h-4" />
                  )}
                  <span className="flex-1 text-sm font-medium text-left">
                    {platformNames[platform]}
                  </span>
                  {isShared && (
                    <Check className="w-4 h-4 text-green-400 animate-in slide-in-from-right-2" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
