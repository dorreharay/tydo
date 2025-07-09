import {
  AudioLines,
  History,
  MessageSquare,
  SquircleDashed,
  X,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@lib/utils';
import Header from '@components/Header';
import ActionButton from '@components/ActionButton';

const suggestions = [
  { text: "How's my business doing?" },
  { text: 'Show me top products' },
  { text: 'What were my sales yesterday?' },
];

function VoicePage() {
  const navigate = useNavigate();
  const [isLive, setIsLive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [animatedTranscription, setAnimatedTranscription] =
    useState<string>('');
  const [showResponse, setShowResponse] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);

  const salesSummary = {
    title: 'Last Sales Campaign Results:',
    points: [
      '12% increase in total revenue',
      '8% improvement in customer engagement',
      '1,200+ units sold across all channels',
      '25% higher conversion rate than previous campaign',
      'New customer acquisition up by 15%',
    ],
  };

  useEffect(() => {
    if (isTranscribing && transcription) {
      const words = transcription.split(' ');
      let currentIndex = 0;

      const interval = setInterval(() => {
        if (currentIndex <= words.length) {
          setAnimatedTranscription(words.slice(0, currentIndex).join(' '));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsTranscribing(false);
          // Show response after transcription completes
          setTimeout(() => {
            setShowResponse(true);
          }, 500);
        }
      }, 150); // 150ms between each word

      return () => clearInterval(interval);
    }
  }, [isTranscribing, transcription]);

  const handleClick = () => {
    if (!isLive) {
      setIsLive(true);
      setTranscription('');
      setAnimatedTranscription('');
      setShowResponse(false);

      // Simulate listening and then transcribing
      setTimeout(() => {
        const userQuery = 'Show me the results of our last sales campaign';
        setTranscription(userQuery);
        setIsTranscribing(true);
      }, 2000); // 2 seconds of "listening"
    } else {
      // Reset everything
      setIsLive(false);
      setTranscription('');
      setAnimatedTranscription('');
      setShowResponse(false);
      setIsTranscribing(false);
    }
  };

  const handleTranscription = (text: string) => {
    setIsLive(true);
    setTranscription(text);
    setAnimatedTranscription('');
    setShowResponse(false);
    setIsTranscribing(true);
  };

  return (
    <div className="overflow-hidden text-gray-900 transition-all duration-100 h-screen-safe dark:bg-stone-900 dark:text-gray-100">
      <div className="flex flex-col h-full p-4 py-8 pb-24 mx-auto">
        <Header isLive={isLive}>
          <>
            <SquircleDashed className="w-6 h-6" />
            {isLive
              ? isTranscribing
                ? 'Tydo is transcribing...'
                : 'Tydo is analyzing...'
              : 'Tydo is ready'}
          </>
        </Header>

        <div className="flex flex-col items-center px-6 pb-[10vh] my-auto">
          {isLive ? (
            !transcription && !animatedTranscription ? (
              <div className="flex flex-col items-center">
                <h1 className="text-2xl dark:text-stone-200 font-euclid">
                  Listening...
                </h1>
              </div>
            ) : (
              <div className="w-full max-w-2xl mt-8">
                {animatedTranscription && (
                  <div className="mb-6">
                    <h3 className="text-xl font-euclid-m dark:text-stone-200">
                      {animatedTranscription}
                      {isTranscribing && (
                        <span className="animate-pulse">|</span>
                      )}
                    </h3>
                  </div>
                )}

                {showResponse && (
                  <div className="p-6 mt-6 bg-stone-100 dark:bg-stone-800 rounded-2xl animate-fade-in animate-duration-500">
                    <h4 className="mb-4 text-lg text-gray-900 font-euclid-m dark:text-gray-100">
                      {salesSummary.title}
                    </h4>
                    <ul className="space-y-2">
                      {salesSummary.points.map((point, index) => (
                        <li
                          key={index}
                          className="flex items-start text-gray-700 text-md font-euclid dark:text-gray-300"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <span className="mr-2 text-green-600 dark:text-green-400">
                            •
                          </span>
                          <span className="animate-fade-in animate-duration-300">
                            {point}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
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

          <>
            {!isLive && (
              <ActionButton
                className="p-5 left-14 bottom-15"
                onClick={() => navigate('/history')}
              >
                <History className="w-6 h-6" />
              </ActionButton>
            )}
            <ActionButton
              className={{
                'bg-rose-800 dark:bg-rose-900': isLive,
              }}
              onClick={handleClick}
            >
              {isLive ? (
                <X className={cn('w-8 h-8', { 'text-white': isLive })} />
              ) : (
                <AudioLines className="w-8 h-8" />
              )}
            </ActionButton>
            {!isLive && (
              <ActionButton
                className="p-5 right-14 bottom-15"
                onClick={() => navigate('/chat')}
              >
                <MessageSquare className="w-6 h-6" />
              </ActionButton>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

export default VoicePage;
