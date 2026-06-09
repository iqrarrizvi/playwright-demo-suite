import { expect } from "@playwright/test";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const WAIT_MS = 20_000;
const VISIBLE_MS = 60_000;

/**
 * Low-level Playwright wrapper.
 * Resolves locators (with optional iframe context), then delegates to the
 * appropriate Playwright assertion or interaction method.
 */
export default class WebActions {
  #page;

  constructor(page) {
    this.#page = page;
  }

  // ── Navigation ────────────────────────────────────────────────────────────

  async navigateToURL(url) {
    await this.#page.goto(url);
  }

  // ── Element resolution ────────────────────────────────────────────────────

  async #locate(locator, frames, waitForVisible = true) {
    let ctx = this.#page;
    if (frames.length > 0) {
      ctx = this.#page.frameLocator(frames[0]);
      for (let i = 1; i < frames.length; i++) ctx = ctx.frameLocator(frames[i]);
    }
    const el = ctx.locator(locator);
    if (waitForVisible) await el.first().waitFor({ timeout: WAIT_MS });
    return el;
  }

  // ── Interactions ──────────────────────────────────────────────────────────

  async clickElement(locator, frames) {
    await (await this.#locate(locator, frames)).click({ timeout: WAIT_MS });
  }

  async clickElementJS(locator, frames) {
    await (await this.#locate(locator, frames)).evaluate((el) => el.click());
  }

  async doubleClickElement(locator, frames) {
    await (await this.#locate(locator, frames)).dblclick();
  }

  async enterElementText(locator, text, frames) {
    await (await this.#locate(locator, frames)).fill(text);
  }

  async keyPress(locator, key, frames) {
    await (await this.#locate(locator, frames)).press(key);
  }

  async checkElement(locator, frames) {
    await (await this.#locate(locator, frames)).check();
  }

  async unCheckElement(locator, frames) {
    await (await this.#locate(locator, frames)).uncheck();
  }

  async hoverOver(locator, frames) {
    await (await this.#locate(locator, frames)).hover();
  }

  async hoverOverForced(locator, frames) {
    await (await this.#locate(locator, frames)).hover({ force: true });
  }

  async uploadFile(locator, fileName, frames) {
    const el = await this.#locate(locator, frames, false);
    await el.setInputFiles(path.join(__dirname, "../Data", fileName));
  }

  async selectOptionFromDropdown(locator, label, frames) {
    await (await this.#locate(locator, frames)).selectOption({ label });
  }

  async selectOptionFromDropdownViaValue(locator, value, frames) {
    await (await this.#locate(locator, frames)).selectOption(value);
  }

  async setAttribute(locator, attribute, value, frames) {
    const el = await this.#locate(locator, frames);
    await el.evaluate((node, [attr, val]) => { node[attr] = val; }, [attribute, value]);
  }

  // ── Getters ───────────────────────────────────────────────────────────────

  async getTextContents(locator, frames) {
    const el = await this.#locate(locator, frames);
    const tag = await el.evaluate((n) => n.tagName.toLowerCase());
    return (tag === "input" || tag === "textarea" || tag === "select")
      ? el.inputValue()
      : el.textContent();
  }

  async getElement(locator, frames) {
    return this.#locate(locator, frames);
  }

  // ── Assertions ────────────────────────────────────────────────────────────

  async verifyElementText(locator, expected, frames) {
    const el = await this.#locate(locator, frames);
    const tag = await el.evaluate((n) => n.tagName.toLowerCase());
    if (tag === "input" || tag === "textarea" || tag === "select") {
      await expect(el).toHaveValue(expected);
    } else {
      await expect(el).toHaveText(expected);
    }
  }

  async verifyElementContainsText(locator, text, frames) {
    await expect(await this.#locate(locator, frames)).toContainText(text);
  }

  async verifyElementIsDisplayed(locator, frames) {
    await expect(await this.#locate(locator, frames)).toBeVisible({ timeout: VISIBLE_MS });
  }

  async verifyElementIsNotDisplayed(locator, frames) {
    await expect(await this.#locate(locator, frames, false)).not.toBeVisible();
  }

  async verifyElementIsEnabled(locator, frames) {
    await expect(await this.#locate(locator, frames)).toBeEnabled();
  }

  async verifyElementIsDisabled(locator, frames) {
    await expect(await this.#locate(locator, frames, false)).toBeDisabled();
  }

  async verifyElementIsHidden(locator, frames) {
    await expect(await this.#locate(locator, frames, false)).toBeHidden({ timeout: VISIBLE_MS });
  }

  async verifyElementIsChecked(locator, frames) {
    await expect(await this.#locate(locator, frames)).toBeChecked();
  }

  async verifyElementNotChecked(locator, frames) {
    await expect(await this.#locate(locator, frames)).not.toBeChecked();
  }

  async verifyElementNotExist(locator, frames) {
    await expect(await this.#locate(locator, frames, false)).toHaveCount(0);
  }

  async verifyElementAttribute(locator, attribute, value, frames) {
    if (value === null) throw new Error(`Expected value is null for attribute check on: ${locator}`);
    await expect(await this.#locate(locator, frames)).toHaveAttribute(attribute, value);
  }

  async verifyElementAttributeNotExist(locator, attribute, frames) {
    await expect(await this.#locate(locator, frames)).not.toHaveAttribute(attribute);
  }

  async verifyTableDataExists(locator, frames) {
    const el = await this.#locate(locator, frames);
    expect(await el.count()).toBeGreaterThan(0);
  }

  async verifyElementPopulated(locator, frames) {
    await expect(await this.#locate(locator, frames)).not.toBeEmpty();
  }

  async verifyHaveClass(locator, className, frames) {
    await expect(await this.#locate(locator, frames)).toHaveClass(className);
  }

  async verifyHaveClassPattern(locator, pattern, frames) {
    await expect(await this.#locate(locator, frames)).toHaveClass(new RegExp(pattern));
  }

  async verifyDateInBetween(locator, from, to, frames) {
    const raw = ((await this.getTextContents(locator, frames)) ?? "").trim();
    const parse = (s) => {
      const [m, d, y] = String(s).trim().split(/[-/]/).map(Number);
      return new Date(y, m - 1, d);
    };
    const [actual, lo, hi] = [raw, from, to].map(parse);
    const [min, max] = lo < hi ? [lo, hi] : [hi, lo];
    if (actual < min || actual > max) {
      throw new Error(`Date "${raw}" is outside range [${from} – ${to}]`);
    }
  }
}
