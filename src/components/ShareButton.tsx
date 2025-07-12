import React from 'react';
import { Share2, Loader2, Check } from 'lucide-react';
import { cn } from '@lib/utils';
import { useSocialShare } from '@hooks/useSocialShare';

interface ShareButtonProps {
  elementId: string;
  platform?: 'share' | 'download';
  title?: string;
  text?: string;
  hashtags?: string[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'stone' | 'ghost' | 'minimal';
}

const sizeConfig = {
  sm: {
    button: 'h-8 w-8',
    icon: 'w-3.5 h-3.5',
  },
  md: {
    button: 'h-10 w-10',
    icon: 'w-4 h-4',
  },
  lg: {
    button: 'h-12 w-12',
    icon: 'w-5 h-5',
  },
};

const variantConfig = {
  stone: {
    base: 'bg-stone-800 hover:bg-stone-700 text-stone-100 border border-stone-700 hover:border-stone-600 shadow-md hover:shadow-lg',
    success: 'bg-green-900 border-green-800 text-green-100',
  },
  ghost: {
    base: 'bg-transparent hover:bg-stone-800/50 text-stone-400 hover:text-stone-100 border border-transparent hover:border-stone-700',
    success: 'bg-green-900/20 text-green-400',
  },
  minimal: {
    base: 'bg-transparent hover:bg-stone-800/30 text-stone-500 hover:text-stone-200',
    success: 'text-green-400',
  },
};

export const ShareButton: React.FC<ShareButtonProps> = ({
  elementId,
  platform = 'share',
  title = 'Check out this chart',
  text = 'Generated with Tydo',
  hashtags = ['analytics'],
  className,
  size = 'md',
  variant = 'stone',
}) => {
  const { share, isSharing } = useSocialShare();
  const [showSuccess, setShowSuccess] = React.useState(false);
  
  const handleShare = async () => {
    try {
      await share(elementId, platform, { title, text, hashtags });
      
      if (platform !== 'download') {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      }
    } catch (error) {
      console.error('Share failed:', error);
    }
  };
  
  const sizes = sizeConfig[size];
  const variants = variantConfig[variant];
  
  return (
    <button
      onClick={handleShare}
      disabled={isSharing}
      className={cn(
        "export-controls rounded-lg transition-all duration-200",
        "flex items-center justify-center",
        "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-stone-500 focus:ring-offset-stone-900",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "group relative overflow-hidden",
        sizes.button,
        showSuccess ? variants.success : variants.base,
        className
      )}
      aria-label={`Share on ${platform}`}
      title={`Share on ${platform}`}
    >
      {/* Ripple effect on click */}
      <span className="absolute inset-0 rounded-lg">
        <span className="absolute inset-0 rounded-lg bg-white opacity-0 group-active:opacity-10 transition-opacity" />
      </span>
      
      {/* Icon */}
      <span className="relative">
        {isSharing ? (
          <Loader2 className={cn(sizes.icon, "animate-spin")} />
        ) : showSuccess ? (
          <Check className={cn(sizes.icon, "animate-in zoom-in duration-200")} />
        ) : (
          <Share2 className={cn(
            sizes.icon,
            "transition-transform group-hover:scale-110 group-active:scale-95"
          )} />
        )}
      </span>
    </button>
  );
};