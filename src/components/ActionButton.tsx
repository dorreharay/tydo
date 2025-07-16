import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

type Props = {
  className?: string | object;
  onClick?: () => void;
  children: ReactNode;
  disabled?: boolean;
};

function ActionButton({ className, onClick, children, disabled }: Props) {
  return (
    <button
      className={cn(
        'absolute bottom-12 p-7 flex items-center justify-center rounded-full shadow-lg dark:bg-stone-800 border dark:border-none border-stone-300',
        className
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
}

export default ActionButton;
