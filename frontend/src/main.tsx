import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App';
import './styles/globals.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: '#141420',
            color: '#f0eef8',
            border: '1px solid #232336',
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: '12px',
          },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
);
