import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/widget-entry.js'),
      name: 'IagoChatWidget',
      fileName: 'iago-chat-widget',
      formats: ['iife'],
    },
    rollupOptions: {
      // Bundle everything — no external dependencies
      external: [],
      output: {
        // IIFE wraps everything, including React
        inlineDynamicImports: true,
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  define: {
    'process.env.NODE_ENV': '"production"',
  },
})
