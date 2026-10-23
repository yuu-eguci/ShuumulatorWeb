import { defineConfig, devices } from '@playwright/test';

// npm run test:e2e が dist-e2e/ (--mode e2e、API は http://api.invalid) をビルドしてから実行します。
export default defineConfig({
  testDir: 'tests/e2e',
  forbidOnly: Boolean(process.env.CI),
  reporter: process.env.CI ? 'github' : 'list',
  use: { baseURL: 'http://localhost:4173' },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'npx vite preview --outDir dist-e2e',
    url: 'http://localhost:4173/ShuumulatorWeb/',
    reuseExistingServer: false,
  },
});
