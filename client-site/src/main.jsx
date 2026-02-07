import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import { TierMemoryProvider } from './context/TierMemoryContext.jsx'
import './index.css'

// Register service worker for PWA support
if ('serviceWorker' in navigator) {
  window.addEventListener('load', async () => {
    try {
      // Unregister any existing service workers to ensure clean state
      const registrations = await navigator.serviceWorker.getRegistrations();
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Old service worker unregistered');
      }

      // Register the updated service worker
      const registration = await navigator.serviceWorker.register('/sw.js', {
        updateViaCache: 'none' // Force fetch fresh service worker
      });
      
      console.log('✅ ServiceWorker registered:', registration.scope);

      // Check for updates
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        console.log('🔄 Service worker update found');
        
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'activated') {
            console.log('✅ Service worker updated and activated');
            window.location.reload(); // Reload to use new service worker
          }
        });
      });

      // Check for updates every 60 seconds
      setInterval(() => {
        registration.update();
      }, 60000);
    } catch (err) {
      console.error('❌ ServiceWorker registration failed:', err);
    }
  });
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <TierMemoryProvider>
      <App />
    </TierMemoryProvider>
  </React.StrictMode>,
)
