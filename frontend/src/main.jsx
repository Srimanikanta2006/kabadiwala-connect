import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { registerSW } from 'virtual:pwa-register'

// Auto-register and update Service Worker for offline asset caching
if ('serviceWorker' in navigator) {
  registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('[PWA] New content available, refresh prompt.');
    },
    onOfflineReady() {
      console.log('[PWA] App is offline ready.');
    },
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

