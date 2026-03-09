import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import { registerSW } from 'virtual:pwa-register'

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  const updateSW = registerSW({
    onNeedRefresh() {
      if (confirm('New content update available! Reload to apply?')) {
        updateSW(true)
      }
    },
    onOfflineReady() {
      console.log('App ready to work offline');
    },
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)