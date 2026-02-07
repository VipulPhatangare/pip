import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Protean Interface Protocol',
        short_name: 'Protean UI',
        description: 'Adaptive UI Survival System',
        theme_color: '#6366f1',
        background_color: '#000000',
        display: 'standalone',
        icons: [
          {
            src: '/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: '/icon-512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              }
            }
          }
        ]
      }
    })
  ],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split tier components into separate chunks
          'tier-a': ['./src/components/tiers/TierA'],
          'tier-b': ['./src/components/tiers/TierB'],
          'tier-c': ['./src/components/tiers/TierC'],
          'tier-d': ['./src/components/tiers/TierD'],
          
          // Split heavy animation libraries
          'framer-motion': ['framer-motion'],
          
          // Core shared components
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // Context and state management
          'state': ['zustand'],
          
          // UX components
          'ux-components': [
            './src/components/TierTransition',
            './src/components/TransitionToast',
            './src/components/OfflineIndicator',
            './src/components/ProgressiveImage',
            './src/components/SkeletonScreen'
          ]
        }
      }
    },
    // Enable code splitting
    chunkSizeWarningLimit: 600, // Warn if chunks exceed 600KB
    // Optimize chunks
    target: 'es2015',
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: ['framer-motion'] // Don't pre-bundle heavy animation lib
  }
});
