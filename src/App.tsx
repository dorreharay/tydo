import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoicePage from '@/pages/VoicePage';
import ChatPage from '@/pages/ChatPage';
import { VoiceProvider } from '@/contexts/VoiceContext';

function App() {
  return (
    <Router>
      <VoiceProvider>
        <Routes>
          <Route path="/" element={<VoicePage />} />
          <Route path="/chat/:text?" element={<ChatPage />} />
        </Routes>
      </VoiceProvider>
    </Router>
  );
}

export default App;
