import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/stats': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/search': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/ask': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/ingest': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/health': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/integrate': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/activities': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/flashcards': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
      '/tokens': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
