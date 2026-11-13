import { defineConfig, mergeConfig } from 'vitest/config';
import viteConfig from './vite.config.ts';

export default mergeConfig(viteConfig, defineConfig({
  test: {
    environment: 'jsdom',
    environmentOptions: { jsdom: { url: 'https://localhost/ShuumulatorWeb/' } },
    include: ['tests/unit/**/*.test.ts'],
    env: { VITE_API_BASE_URL: 'http://api.invalid' },
  },
}));
