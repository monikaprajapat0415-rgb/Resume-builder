import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// In development, the React app runs on port 5173 and calls /api. Vite forwards those calls to the Express
// server on port 5000, so the browser sees ONE origin and we avoid CORS trouble while developing.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: { '/api': 'http://localhost:5000' },
  },
});
