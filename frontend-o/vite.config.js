import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  base: '/bluetek/', // ← Esto es crucial
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.js'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      statements: 95,
      branches: 95,
      functions: 95,
      lines: 95
    }
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    // Para SPA - manejar rutas del cliente
    rollupOptions: {
      input: {
        main: './index.html'
      }
    }
  }
})