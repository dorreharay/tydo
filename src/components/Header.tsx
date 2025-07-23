import { ArrowLeft, AudioLines } from 'lucide-react';
import { cn } from '../lib/utils';
import ThemeToggle from '@components/ThemeToggle';
import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

type Props = {
  isLive?: boolean;
  canGoBack?: boolean;
  children?: ReactNode;
};

function Header({ isLive, canGoBack, children }: Props) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        {canGoBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-2.5 sm:p-3 transition-colors duration-200 rounded-full cursor-pointer bg-stone-100 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-600"
            aria-label="Toggle theme"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}
      </div>
      <div
        className={cn(
          'flex items-center justify-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-1.5 sm:py-2 text-sm sm:text-lg rounded-full w-fit h-fit bg-stone-100 dark:bg-stone-800 font-euclid',
          { 'pr-4': isLive }
        )}
      >
        {isLive ? (
          <>
            <AudioLines className="w-4 h-4 sm:w-6 sm:h-6" />
            Live
            <div className="relative w-1.5 h-1.5 sm:w-2 sm:h-2 bg-teal-700 rounded-full dark:bg-teal-200 -top-0.5 sm:-top-1 -left-0.5 sm:-left-1" />
          </>
        ) : (
          children
        )}
      </div>

      <div className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Header;
