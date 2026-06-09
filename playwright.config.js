// @ts-check
import { defineConfig } from '@playwright/test';
import { AppConfig } from './config.js';

const isCI = !!process.env.CI;

export default defineConfig({
  timeout: 30000,
  testDir: './tests',

  fullyParallel: true,

  forbidOnly: isCI,

  retries: isCI ? 2 : 0,

  workers: isCI ? 2 : undefined,

  outputDir: 'test-results/',

  reporter: isCI
    ? [
        ['html', { open: 'never', outputFolder: 'playwright-report' }],
        ['junit', { outputFile: 'test-results/junit.xml' }],
        ['json', { outputFile: 'test-results/results.json' }],
        ['list']
      ]
    : [
        ['html', { open: 'on-failure', outputFolder: 'playwright-report' }],
        ['list']
      ],

  use: {
    baseURL: AppConfig.BaseURL,

    trace: 'on-first-retry',

    screenshot: {
      mode: 'on',
      fullPage: true
    },

    video: 'retain-on-failure',

    headless: isCI ? true : false,

    viewport: { width: 1280, height: 720 }
  },

  projects: [
    {
      name: 'chromium',
      use: {
        launchOptions: {
          args: ['--no-sandbox']
        }
      }
    }
  ]
});
