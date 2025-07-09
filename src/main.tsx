import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from './contexts/ThemeContext'

// Set custom viewport height property
const setViewportHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

// Set on load
setViewportHeight();

// Update on resize and orientation change
window.addEventListener('resize', setViewportHeight);
window.addEventListener('orientationchange', setViewportHeight);

// Handle visual viewport changes (keyboard open/close)
if ('visualViewport' in window) {
  window.visualViewport?.addEventListener('resize', () => {
    const hasKeyboard = window.visualViewport!.height < window.innerHeight;
    if (hasKeyboard) {
      document.documentElement.style.setProperty('--keyboard-height', 
        `${window.innerHeight - window.visualViewport!.height}px`);
    } else {
      document.documentElement.style.setProperty('--keyboard-height', '0px');
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>,
)
