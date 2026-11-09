import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command:
      'bun run build && bunx wrangler d1 migrations apply food-objects --local && bunx wrangler dev --port 4321',
    url: 'http://localhost:4321',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
