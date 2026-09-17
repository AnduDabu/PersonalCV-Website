import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        // Stable vendor chunks: these change far less often than app code, so returning
        // visitors keep them cached across deploys. Pages are split by React.lazy in App.jsx.
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
          motion: ['framer-motion'],
        },
      },
    },
  },
})
