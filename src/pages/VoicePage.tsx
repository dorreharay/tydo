import {
  AudioLines,
  History,
  MessageSquare,
  SquircleDashed,
  StepForward,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@lib/utils';
import Header from '@components/Header';
import ActionButton from '@components/ActionButton';
import { useVoice } from '@contexts/VoiceContext';

const suggestions = [
  { text: "How's my business doing?" },
  { text: 'Show me top products' },
  { text: 'What were my sales yesterday?' },
];

function VoicePage() {
  const navigate = useNavigate();
  const {
    setLastTranscription,
    shouldStartRecording,
    setShouldStartRecording,
  } = useVoice();
  const [isLive, setIsLive] = useState(false);
  const [transcription, setTranscription] = useState<string>('');
  const [animatedTranscription, setAnimatedTranscription] =
    useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  useEffect(() => {
    // Check if we should start recording automatically
    if (shouldStartRecording && !isLive) {
      setShouldStartRecording(false);
      handleClick();
    }
  }, [shouldStartRecording]); // eslint-disable-line react-hooks/exhaustive-deps

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
          // Keep the voice input open - user must click finish
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

      // Simulate listening and then transcribing
      setTimeout(() => {
        const userQuery = 'Show me the results of our last sales campaign';
        setTranscription(userQuery);
        setIsTranscribing(true);
      }, 2000); // 2 seconds of "listening"
    } else {
      // When clicking finish, navigate to chat with the transcription
      if (transcription) {
        handleContinueInChat();
      } else {
        // If no transcription, just close
        setIsLive(false);
        setTranscription('');
        setAnimatedTranscription('');
        setIsTranscribing(false);
      }
    }
  };

  const handleTranscription = (text: string) => {
    // Go directly to chat with the suggestion text
    setLastTranscription({
      text: text,
      timestamp: new Date(),
    });
    navigate('/chat');
  };

  const handleContinueInChat = () => {
    if (transcription) {
      setLastTranscription({
        text: transcription,
        timestamp: new Date(),
      });
      navigate('/chat');
    }
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

        <div className="flex flex-col items-center px-6 pb-[15vh] my-auto max-h-[70vh] overflow-auto">
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
              className={cn({
                'w-3/4 h-10 rounded-xl': isLive,
                'bg-rose-800 dark:bg-rose-800': isLive && transcription,
                'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50': isLive && !transcription,
              })}
              onClick={(isLive && transcription) || !isLive ? handleClick : undefined}
            >
              {isLive ? (
                <div className="flex items-center justify-center gap-1 text-lg text-white font-euclid-m">
                  Continue
                  <StepForward />
                </div>
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
