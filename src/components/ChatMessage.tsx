import { cn } from '@lib/utils';

interface ChatMessageProps {
  message: string;
  source: 'user' | 'ai';
}

export const ChatMessage = ({ message, source }: ChatMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={cn(
        'flex border-none',
        source === 'user' ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'flex flex-col max-w-[80%] p-3 rounded-2xl border-none',
          source === 'user'
            ? 'bg-rose-800 text-white'
            : 'bg-stone-200 dark:bg-stone-900 text-gray-900 dark:text-gray-100'
        )}
      >
        <p className="text-left text-md font-euclid">{message}</p>
      </div>
    </div>
  );
};