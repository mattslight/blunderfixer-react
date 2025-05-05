import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import App from './App.jsx';
import DevErrorBoundary from './components/DevErrorBoundary.jsx';
import './index.css';

import 'flowbite';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <DevErrorBoundary>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </DevErrorBoundary>
  </StrictMode>
);
