import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuração de build estático compatível com desenvolvimento local e GitHub Pages
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
});
