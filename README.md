# Playwright TypeScript Project

## Introduction

This repository is designed for automated end-to-end testing using [Playwright](https://playwright.dev/).

---

## Prerequisites

Before starting, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v21.x or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- A modern code editor like [Visual Studio Code](https://code.visualstudio.com/)

---

## Installation

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install
   ```

---

## Project Structure

```plaintext
helsi-aga-playwright-tests/
├── api/                  # API controllers and builders
├── app/                  # Page objects and components
├── data/                 # Data configs for tests
├── tests/                # Test files
├── utils/                # Utility functions and custom helpers
├── models/               # TypeScript interfaces
├── fixtures/             # Test data and fixtures
├── playwright.config.ts  # Playwright configuration
├── package.json          # Project dependencies and scripts
├── tsconfig.json         # TypeScript configuration
└── README.md             # Project documentation
```

---

## Scripts

The following scripts are available in the `package.json`:

- **Run Tests**:

  ```bash
  npm test
  ```

- **Run a Specific Test**:

  ```bash
  npx playwright test tests/example.spec.ts
  ```

- **Generate HTML Report**:

  ```bash
  npx playwright show-report
  ```

- **Debug Tests**:

  ```bash
  npx playwright test --debug
  ```

- **UI Mode**:

  ```bash
  npx playwright test --ui
  ```

---

## Configuration

The Playwright configuration is managed in `playwright.config.ts`. Customize the following options:

- **Browsers**: Define which browsers (Chromium, Firefox, WebKit) to test.
- **Test Directory**: Set the directory where tests are located.
- **Timeouts**: Configure test and action timeouts.
- **Reports**: Specify reporters (e.g., HTML, JSON).

Example:

```typescript
import { defineConfig } from '@playwright/test';

export default defineConfig({
  timeout: 30000,
  retries: 2,
  use: {
    headless: true,
    baseURL: 'https://example.com',
    screenshot: 'on',
    trace: 'on',
  },
  projects: [
    { name: 'Chromium', use: { browserName: 'chromium' } },
    { name: 'Firefox', use: { browserName: 'firefox' } },
    { name: 'WebKit', use: { browserName: 'webkit' } },
  ],
});
```

---

## Writing Tests

Create your test files inside the `tests/` directory. Example:

```typescript
import { test, expect } from '@playwright/test';

test('Basic Test', async ({ page }) => {
  await page.goto('https://example.com');
  const title = await page.title();
  expect(title).toBe('Example Domain');
});
```

### Test Fixtures

Define reusable fixtures in the `fixtures/` directory for common test setups.

Example:

```typescript
import { test as base, expect } from '@playwright/test';

const test = base.extend({
  userData: async ({}, use) => {
    await use({ username: 'test-user', password: 'secure-password' });
  },
});

test('Test with Fixture', async ({ page, userData }) => {
  await page.goto('https://example.com');
  console.log(userData.username); // Outputs: test-user
});
```

---

## Reports & Traces

### Generating Reports

Reports are automatically generated in the `playwright-report/` directory after a test run. Open the report:

```bash
npx playwright show-report
```

### Capturing Traces

Enable trace recording in `playwright.config.ts` by setting `trace: 'on'` or `trace: 'retain-on-failure'`. View traces:

```bash
npx playwright show-trace trace.zip
```

---

## Debugging

1. **Run Tests in Debug Mode**:

   ```bash
   npx playwright test --debug
   ```

2. **Pause on Failures**:

   Add `.pause()` in your test for interactive debugging:

   ```typescript
   await page.pause();
   ```

---

## Resources

- [Playwright Documentation](https://playwright.dev/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
