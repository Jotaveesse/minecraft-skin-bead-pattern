import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Force sourcemaps to be explicitly generated and tracked
  css: {
    devSourcemap: true,
  },
  build: {
    sourcemap: true,
  }
})