# playwright-demo-suite

![CI](https://github.com/iqrarrizvi/playwright-demo-suite/actions/workflows/playwright.yml/badge.svg)

A Playwright E2E automation suite targeting the public [Sauce Demo](https://www.saucedemo.com) storefront. Built with a Page Object Model architecture and reusable action helpers — **clone it and run it yourself with no credentials to configure**.

---

## What It Tests

| Suite | Tag | Coverage |
|---|---|---|
| Smoke | `@smoke` | Login, products page, logout |
| Login Regression | `@regression` | Valid login, invalid credentials, locked-out user |
| Inventory Regression | `@regression` | Item count, add/remove cart, sort by name/price |
| Checkout Regression | `@regression` | Full E2E checkout flow, form validation, cart persistence |

**14 tests across 4 files.**

---

## Project Structure

```
├── tests/
│   ├── smoketests.spec.js
│   ├── loginRegression.spec.js
│   ├── inventoryRegression.spec.js
│   └── checkoutRegression.spec.js
├── pageObjects/          # Locators per page (LoginObjects, InventoryObjects, ...)
├── Helper/               # Login helper (handles navigation + credential injection)
├── Actions/              # ActionHelper dispatcher, Hooks (beforeEach login)
├── Utils/                # WebActions, action types, test data, screenshots
├── config.js             # App config (reads from env vars, defaults to saucedemo.com)
├── playwright.config.js  # Playwright configuration
└── .github/workflows/    # GitHub Actions CI
```

---

## Quick Start

```bash
# 1. Clone and install
git clone https://github.com/iqrarrizvi/playwright-demo-suite.git
cd playwright-demo-suite
npm install

# 2. Install Playwright browser
npx playwright install chromium

# 3. Run smoke tests
npm run smoke

# 4. Run full regression
npm run regression

# 5. Open Playwright UI mode (great for debugging)
npx playwright test --ui
```

No `.env` file required — the suite defaults to `https://www.saucedemo.com` with the public test credentials.

---

## Configuration

Copy `.env.example` to `.env` if you want to point the suite at a different target app:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `BASE_URL` | `https://www.saucedemo.com` | Target application URL |
| `TEST_USERNAME` | `standard_user` | Primary test user |
| `TEST_PASSWORD` | `secret_sauce` | Primary test password |

---

## CI/CD

GitHub Actions runs the smoke suite on every push and pull request to `main`. The badge above reflects the latest run.

The workflow:
- Runs on `ubuntu-latest`
- Installs Node 20 + Playwright Chromium
- Executes `npm run smoke` (3 tests)
- Uploads the Playwright HTML report as an artifact (7-day retention)

---

## Tech Stack

- **Playwright** — browser automation
- **Node.js** — test runner
- **GitHub Actions** — CI/CD
