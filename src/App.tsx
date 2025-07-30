import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoicePage from '@/pages/VoicePage';
import ChatPage from '@/pages/ChatPage';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { NavigationProvider } from '@/contexts/NavigationContext';
import { ChartStreamProvider } from '@/contexts/ChartStreamContext';

function App() {
  return (
    <Router>
      <NavigationProvider>
        <ChartStreamProvider>
          <VoiceProvider>
            <Routes>
              <Route path="/" element={<VoicePage />} />
              <Route path="/chat" element={<ChatPage />} />
            </Routes>
          </VoiceProvider>
        </ChartStreamProvider>
      </NavigationProvider>
    </Router>
  );
}

export default App;
