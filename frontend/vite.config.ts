import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // In production (Vercel) the /api/* requests are routed to the Python
  // serverless function by vercel.json — no proxy needed.
  // The proxy below only applies when running `npm run dev` locally.
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:5000',
        changeOrigin: true,
      },
    },
  },
})
