import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  build: {
    // Code splitting
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['vue', 'vue-router', 'pinia'],
          'ui': ['naive-ui'],
          'markdown': ['markdown-it', 'highlight.js']
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Minify
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})
