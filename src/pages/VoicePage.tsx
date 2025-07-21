import { AudioLines, SquircleDashed } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@lib/utils';
import Header from '@components/Header';
import ActionButton from '@components/ActionButton';
import { useNavigation } from '@/contexts/NavigationContext';

const suggestions = [
  { text: "How's my business doing?" },
  { text: 'Show me top products' },
  { text: 'What were my sales yesterday?' },
];

function VoicePage() {
  const navigate = useNavigate();
  const { setInitialMessage } = useNavigation();
  
  const handleContinueInChat = (text?: string) => {
    if (text) {
      setInitialMessage(text);
    }
    navigate('/chat');
  };

  return (
    <div className="overflow-hidden text-gray-900 transition-all duration-100 h-screen-safe dark:bg-stone-900 dark:text-gray-100">
      <div className="flex flex-col h-full p-4 py-4 pb-24 mx-auto">
        <Header>
          <>
            <SquircleDashed className="w-6 h-6" />
            Tydo is ready
          </>
        </Header>

        <div className="flex flex-col items-center px-6 pb-[15vh] my-auto max-h-[70vh] overflow-auto">
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
                  onClick={() => handleContinueInChat(suggestion.text)}
                  key={suggestion.text}
                >
                  {suggestion.text}
                </button>
              ))}
            </div>
          </>

          <ActionButton
            className="active:scale-[0.95] active:bg-stone-700 transition-all duration-20"
            onClick={() => handleContinueInChat('')}
          >
            <AudioLines className="w-8 h-8" />
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

export default VoicePage;
