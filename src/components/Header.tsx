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
    <div className="flex items-center justify-between">
      <div className="w-12 h-12">
        {canGoBack && (
          <button
            onClick={() => navigate(-1)}
            className="p-3 transition-colors duration-200 rounded-full cursor-pointer bg-stone-100 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-600"
            aria-label="Toggle theme"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}
      </div>
      <div
        className={cn(
          'flex items-center justify-center gap-2 px-6 py-2 mx-auto text-lg rounded-full w-fit h-fit bg-stone-100 dark:bg-stone-800 font-euclid',
          { 'pr-4': isLive }
        )}
      >
        {isLive ? (
          <>
            <AudioLines className="w-6 h-6" />
            Live
            <div className="relative w-2 h-2 bg-teal-700 rounded-full dark:bg-teal-200 -top-1 -left-1" />
          </>
        ) : (
          children
        )}
      </div>

      <div className="w-12">
        <ThemeToggle />
      </div>
    </div>
  );
}

export default Header;
