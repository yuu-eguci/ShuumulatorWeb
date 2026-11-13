import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  // GitHub Pages の https://yuu-eguci.github.io/ShuumulatorWeb/ で配信するためのパスです。
  base: '/ShuumulatorWeb/',
  resolve: {
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  server: { port: 8080 },
});
