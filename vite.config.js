import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from "path"
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
    server: {
    host: true, // allow network access
    port: 5173,
    allowedHosts: ['.ngrok-free.dev'], // 👈 allow ngrok URLs
  },
    resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
