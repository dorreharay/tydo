import {
  AudioLines,
  History,
  MessageSquare,
  SquircleDashed,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@lib/utils';
import Header from '@components/Header';
import ActionButton from '@components/ActionButton';
import { useVoice } from '@contexts/VoiceContext';
import { useConversation } from '@elevenlabs/react';

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
  const [transcription, setTranscription] = useState<string>('');
  const [animatedTranscription, setAnimatedTranscription] =
    useState<string>('');
  const [isTranscribing, setIsTranscribing] = useState(false);

  const conversation = useConversation({
    onDisconnect: () => {
      console.log('DISCONNECTED');
    },
    onMessage: message => {
      console.log('MESSAGE', message);
    },
  });

  const { startSession, endSession, isSpeaking, status } = conversation;

  console.log('conversation', conversation);

  useEffect(() => {
    // Check if we should start recording automatically
    if (shouldStartRecording && status === 'disconnected') {
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

  const handleClick = async () => {
    if (status === 'disconnected') {
      setTranscription('');
      setAnimatedTranscription('');

      navigate('/chat?voice=true');
    } else {
      // When clicking finish, navigate to chat with the transcription
      if (transcription) {
        handleContinueInChat();
      } else {
        // If no transcription, just close
        endSession();
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
        <Header isLive={status === 'connected' || status === 'connecting'}>
          <>
            <SquircleDashed className="w-6 h-6" />
            {status === 'connecting'
              ? 'Connecting...'
              : status === 'connected'
                ? isTranscribing
                  ? 'Tydo is transcribing...'
                  : isSpeaking
                    ? 'Tydo is speaking...'
                    : 'Tydo is listening...'
                : 'Tydo is ready'}
          </>
        </Header>

        <div className="flex flex-col items-center px-6 pb-[15vh] my-auto max-h-[70vh] overflow-auto">
          {status === 'connecting' ? (
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-32 h-32">
                <div className="absolute inset-0 border-4 rounded-full border-stone-200 dark:border-stone-700"></div>
                <div className="absolute inset-0 border-4 border-transparent rounded-full border-t-blue-500 animate-spin"></div>
                <div
                  className="absolute border-4 border-transparent rounded-full inset-2 border-t-purple-500 animate-spin"
                  style={{
                    animationDuration: '1.5s',
                    animationDirection: 'reverse',
                  }}
                ></div>
                <div
                  className="absolute border-4 border-transparent rounded-full inset-4 border-t-pink-500 animate-spin"
                  style={{ animationDuration: '2s' }}
                ></div>
              </div>
              <h2 className="text-xl font-euclid-m text-stone-600 dark:text-stone-400">
                Connecting to Tydo...
              </h2>
            </div>
          ) : status === 'connected' ? (
            !transcription && !animatedTranscription ? (
              <div className="flex flex-col items-center gap-6">
                <div className="relative w-32 h-32">
                  {isSpeaking ? (
                    <>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 opacity-20 animate-ping"></div>
                      <div
                        className="absolute rounded-full inset-2 bg-gradient-to-r from-purple-500 to-pink-500 opacity-30 animate-ping"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="absolute rounded-full inset-4 bg-gradient-to-r from-purple-500 to-pink-500 opacity-40 animate-ping"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-pink-500"></div>
                      <div className="absolute bg-white rounded-full inset-1 dark:bg-stone-900"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex gap-1">
                          <div
                            className="w-2 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                            style={{ animationDuration: '0.5s' }}
                          ></div>
                          <div
                            className="w-2 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                            style={{
                              animationDuration: '0.6s',
                              animationDelay: '0.1s',
                            }}
                          ></div>
                          <div
                            className="w-2 h-10 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                            style={{
                              animationDuration: '0.5s',
                              animationDelay: '0.2s',
                            }}
                          ></div>
                          <div
                            className="w-2 rounded-full h-14 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                            style={{
                              animationDuration: '0.7s',
                              animationDelay: '0.3s',
                            }}
                          ></div>
                          <div
                            className="w-2 rounded-full h-9 bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse"
                            style={{
                              animationDuration: '0.5s',
                              animationDelay: '0.4s',
                            }}
                          ></div>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                      <div className="absolute bg-white rounded-full inset-1 dark:bg-stone-900"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse"></div>
                      </div>
                    </>
                  )}
                </div>
                <h2 className="text-xl font-euclid-m text-stone-600 dark:text-stone-400">
                  {isSpeaking ? 'Speaking...' : 'Listening...'}
                </h2>
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
            {status === 'disconnected' && (
              <ActionButton
                className="p-5 left-14 bottom-15"
                onClick={() => navigate('/history')}
              >
                <History className="w-6 h-6" />
              </ActionButton>
            )}
            <ActionButton
              className={cn({
                'w-3/4 h-10 rounded-xl':
                  status === 'connected' || status === 'connecting',
                'bg-rose-800 dark:bg-rose-800':
                  status === 'connected' && transcription,
                'bg-gray-400 dark:bg-gray-600 cursor-not-allowed opacity-50':
                  (status === 'connected' && !transcription) ||
                  status === 'connecting',
              })}
              onClick={status === 'connecting' ? undefined : handleClick}
              disabled={status === 'connecting'}
            >
              {status === 'connecting' ? (
                <div className="flex items-center justify-center gap-2 text-lg text-white font-euclid-m">
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: '0ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-white rounded-full animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  ></div>
                </div>
              ) : status === 'connected' ? (
                <div className="flex items-center justify-center gap-1 text-lg text-white font-euclid-m">
                  End Session
                </div>
              ) : (
                <AudioLines className="w-8 h-8" />
              )}
            </ActionButton>
            {status === 'disconnected' && (
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
