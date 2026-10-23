import { defineConfig, devices } from '@playwright/test';

// npm run test:e2e が dist-e2e/ (--mode e2e、API は http://api.invalid) をビルドしてから実行します。
// 配信は GitHub Pages と同じく、存在しないパスに 404.html を返すサーバで行います。
export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4173' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'node tests/e2e/pages-server.js dist-e2e 4173',
    url: 'http://localhost:4173/ShuumulatorWeb/',
    reuseExistingServer: false,
  },
});
