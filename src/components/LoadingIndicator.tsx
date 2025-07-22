interface LoadingIndicatorProps {
  isUser?: boolean;
}

export const LoadingIndicator = ({ isUser = false }: LoadingIndicatorProps) => {
  const bgColor = isUser ? 'bg-rose-800' : 'bg-stone-100 dark:bg-stone-900';
  const dotColor = isUser
    ? 'bg-white'
    : 'bg-stone-600 dark:bg-stone-400';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`p-5 rounded-full ${bgColor}`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className={`w-1 h-1 ${dotColor} rounded-full animate-bounce`} />
            <div
              className={`w-1 h-1 ${dotColor} rounded-full animate-bounce [animation-delay:0.2s]`}
            />
            <div
              className={`w-1 h-1 ${dotColor} rounded-full animate-bounce [animation-delay:0.4s]`}
            />
          </div>
        </div>
      </div>
    </div>
  );
};