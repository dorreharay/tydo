import { AudioLines, Check, SquircleDashed } from 'lucide-react';
import { ThemeToggle } from './components/ThemeToggle';
import { useState } from 'react';
import { cn } from './lib/utils';

const suggestions = [
  { text: "How's my business doing?" },
  { text: 'Show me top products' },
  { text: 'What were my sales yesterday?' },
];

function App() {
  const [isLive, setIsLive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');

  const handleClick = () => {
    if (!isLive) {
      setIsLive(prev => !prev);
    } else {
      setTranscription('Please show me the result of last sale compain');
    }
  };

  const handleTranscription = (text: string) => {
    setTranscription(text);
    setIsLive(true);
  };

  return (
    <div className="min-h-screen text-gray-900 transition-all duration-100 dark:bg-stone-900 dark:text-gray-100">
      <div className="flex flex-col h-screen p-4 py-8 pb-24 mx-auto">
        <div className="flex items-center justify-between">
          <div className="w-12 h-12" />
          <div
            className={cn(
              'flex items-center justify-center gap-2 px-6 py-2 mx-auto text-lg rounded-full w-fit h-fit bg-stone-100 dark:bg-stone-800 font-euclid',
              { 'pr-4': isLive }
            )}
          >
            {!isLive ? (
              <SquircleDashed className="w-6 h-6" />
            ) : (
              <AudioLines className="w-6 h-6" />
            )}
            {isLive ? 'Live' : 'Tydo is ready'}
            {isLive ? (
              <div className="relative w-2 h-2 bg-teal-700 rounded-full dark:bg-teal-200 -top-1 -left-1" />
            ) : null}
          </div>

          <div className="w-12">
            <ThemeToggle />
          </div>
        </div>

        <div className="flex flex-col items-center px-6 pb-[20vh] my-auto">
          {isLive ? (
            transcription ? (
              <div className="px-4 py-2 text-left rounded-full dark:text-stone-200">
                <h3 className="text-xl font-euclid-m">{transcription}</h3>
                <p className="mt-4 text-md font-euclid">
                  Sure! The last sales campaign resulted in a 12% increase in
                  revenue, 8% more customer engagement, and over 1,200 units
                  sold across all channels.
                </p>
              </div>
            ) : (
              <h1 className="text-2xl dark:text-stone-200 font-euclid">
                Listening...
              </h1>
            )
          ) : (
            <>
              <h1 className="text-2xl dark:text-stone-200 font-euclid">
                Welcome to Tydo Voice Assistant!
              </h1>
              <div className="flex flex-wrap gap-2 mt-12">
                {suggestions?.map(suggestion => (
                  <button
                    className={cn(
                      'px-4 py-2 border rounded-full cursor-pointer text-md dark:text-stone-200 bg-stone-100 dark:bg-stone-800 font-euclid border-stone-200 dark:border-stone-400 hover:bg-stone-300 dark:hover:bg-stone-600',
                      'active:scale-[0.95] active:bg-stone-700 transition-all duration-20'
                    )}
                    onClick={() => handleTranscription(suggestion.text)}
                    key={suggestion.text}
                  >
                    {suggestion.text}
                  </button>
                ))}
              </div>
            </>
          )}

          {!transcription && (
            <button
              className={cn(
                'absolute bottom-12 p-7 rounded-full shadow-lg dark:bg-stone-800 border dark:border-none border-stone-300',
                {
                  'bg-rose-800 dark:bg-rose-900': isLive,
                }
              )}
              onClick={handleClick}
            >
              {isLive ? (
                <Check className={cn('w-8 h-8', { 'text-white': isLive })} />
              ) : (
                <AudioLines className="w-8 h-8" />
              )}
            </button>
          )}

          {transcription && (
            <button
              className={cn(
                'mt-6 px-4 py-2 border rounded-full cursor-pointer text-md dark:text-stone-200 bg-stone-100 dark:bg-stone-800 font-euclid border-stone-200 dark:border-stone-400 hover:bg-stone-300 dark:hover:bg-stone-600'
              )}
              onClick={() => {
                setIsLive(false);
                setTranscription('');
              }}
            >
              Go Back
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
