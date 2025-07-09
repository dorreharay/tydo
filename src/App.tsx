import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import VoicePage from '@/pages/VoicePage';
import ChatPage from '@/pages/ChatPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<VoicePage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Routes>
    </Router>
  );
}

export default App;