import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoicePage from '@/pages/VoicePage';
import ChatPage from '@/pages/ChatPage';
import { VoiceProvider } from '@/contexts/VoiceContext';
import { NavigationProvider } from '@/contexts/NavigationContext';

function App() {
  return (
    <Router>
      <NavigationProvider>
        <VoiceProvider>
          <Routes>
            <Route path="/" element={<VoicePage />} />
            <Route path="/chat" element={<ChatPage />} />
          </Routes>
        </VoiceProvider>
      </NavigationProvider>
    </Router>
  );
}

export default App;
