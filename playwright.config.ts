import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import resources from './resources/index';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */

// Load environment variables from .env file
dotenv.config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */

export const envName = process.env.ENV_NAME || 'aqa';
export const envCategory = process.env.ENV_CATEGORY || 'aqa';
export const baseURL =  `https://${envName}.helsi.pro`;
export const authHost = `https://${envName}id.helsi.pro`;
export const { doctors, patients } = resources[envCategory];
export const headless = process.env.HEADLES_MODE === 'true';

export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : 3,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['list'], ['html']],
  expect: {
    timeout: 20_000,
  },
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: baseURL,
    actionTimeout: 20_000,
    navigationTimeout: 20_000,
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    /* https://trace.playwright.dev/ online tool to debug traces for CI*/
    trace: 'on-first-retry',
  },
  timeout: 180_000,
  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        deviceScaleFactor: undefined,
        viewport: null, // Maximize browser window
        launchOptions: {
          args: [
            '--window-size=1920,1080',
            '--no-sandbox', 
            '--disable-dev-shm-usage'
          ],
          headless: headless,
        },
      },
    },
    // {
    //   name: 'firefox',
    //   use: {
    //     ...devices['Desktop Firefox'],
    //     viewport: { width: 1440, height: 900 },
    //   },
    // },
    // {
    //   name: 'webkit',
    //   use: {
    //     ...devices['Desktop Safari'],
    //     viewport: { width: 1440, height: 900 }
    //   },
    // },

    /* Test against branded browsers. */
    // {
    //   name: 'Microsoft Edge',
    //   use: { ...devices['Desktop Edge'], channel: 'msedge' },
    // },
    // {
    //   name: 'Google Chrome',
    //   use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    // },
  ],
});
