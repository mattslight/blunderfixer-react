import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { createTheme, ThemeProvider } from 'flowbite-react';

import App from './App.jsx';
import DevErrorBoundary from './components/DevErrorBoundary.jsx';
import './index.css';

import 'flowbite';
import { BackgroundPatternProvider } from '@/contexts/BackgroundPatternProvider';
import { ProfileProvider } from '@/hooks/useProfile';

const drawerTheme = createTheme({
  drawer: {
    root: {
      backdrop: 'fixed inset-0 z-30 bg-stone-900/50 dark:bg-stone-900/80',
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DevErrorBoundary>
        <ProfileProvider>
          <BackgroundPatternProvider>
            <ThemeProvider theme={drawerTheme}>
              <App />
            </ThemeProvider>
          </BackgroundPatternProvider>
        </ProfileProvider>
      </DevErrorBoundary>
    </BrowserRouter>
  </StrictMode>
);
