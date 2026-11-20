import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import glsl from 'vite-plugin-glsl';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [react(), glsl()],
  resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } },
  server: { port: 5173, strictPort: true, proxy: { '/api': 'http://127.0.0.1:4000' } },
  preview: { port: 4173, proxy: { '/api': 'http://127.0.0.1:4000' } },
  build: {
    target: 'es2022', sourcemap: false,
    rollupOptions: {
      output: { manualChunks(id) {
        if (!id.includes('node_modules')) return;
        if (/node_modules[\\/]three[\\/]/.test(id)) return 'three';
        if (id.includes('gsap')) return 'gsap';
        if (/framer-motion|motion-dom|motion-utils/.test(id)) return 'motion';
        if (/node_modules[\\/](react|react-dom|scheduler|react-router|react-router-dom|zustand|zod|react-hook-form|react-helmet-async)[\\/]/.test(id)) return 'vendor';
        return undefined;
      } }
    }
  }
});
