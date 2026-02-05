// pages/TestPages.ts
import { Page as PWPage, Locator, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

export enum MOUSE_TYPE {
  MOUSEOVER = 'MOUSEOVER',
  CLICKLEFT = 'CLICKLEFT',
}

type MenuStep = {
  type: MOUSE_TYPE;
  /** Selector string. Use XPath (starting with `//` or `(`) or CSS. */
  ele: string;
};

type MenuJson = {
  step1?: MenuStep;
  step2?: MenuStep;
  step3?: MenuStep;
  /** Optional screenshot file name after opening the menu. */
  fileName?: string;
};

const MENU_ITEM_TIMEOUT = Number(process.env.MENU_ITEM_TIMEOUT ?? 15_000);
const ELEMENT_TIMEOUT = Number(process.env.ELEMENT_TIMEOUT ?? 15_000);
const RETRY_INTERVAL_TIMES = Number(process.env.RETRY_INTERVAL_TIMES ?? 2);

/**
 * Base test helper (Playwright).
 * - Provides UX waits, menu steps, screenshots, window switching, and data loading.
 */
export abstract class TestPages {
  constructor(protected readonly page: PWPage) {}

  /** Wait for common UX spinners/overlays and network idle. */
  public async waitLoading(extraSpinnerSelectors: string[] = []): Promise<void> {
    const spinnerSelectors = [
      '.ux-loading',
      '.loading',
      '.spinner',
      '.mat-progress-spinner',
      '.cdk-overlay-backdrop',
      ...extraSpinnerSelectors,
    ];
    for (const sel of spinnerSelectors) {
      const sp = this.page.locator(sel).first();
      try {
        if (await sp.isVisible({ timeout: 400 }).catch(() => false)) {
          await sp.waitFor({ state: 'hidden', timeout: 15_000 });
        }
      } catch {
        /* ignore individual spinner waits */
      }
    }
    await this.page.waitForLoadState('networkidle');
  }

  /** Handle a single menu step (hover/click). */
  public async handlerStep(step?: MenuStep): Promise<void> {
    if (!step || !step.type || !step.ele) return;

    const locator = this.resolveLocator(step.ele);

    switch (step.type) {
      case MOUSE_TYPE.MOUSEOVER:
        await expect(locator).toBeVisible({ timeout: MENU_ITEM_TIMEOUT });
        await locator.hover();
        break;

      case MOUSE_TYPE.CLICKLEFT:
        await expect(locator).toBeVisible({ timeout: MENU_ITEM_TIMEOUT });
        await locator.click(); // left click by default
        break;

      default:
        break;
    }
  }

  /** Switch focus to an existing page (tab/window) by matching title or URL. Returns the page found. */
  public async switchToWindow(match: string, opts: { exact?: boolean; timeout?: number } = {}) {
    const { exact = false, timeout = 10_000 } = opts;
    const start = Date.now();
    while (Date.now() - start < timeout) {
      for (const p of this.page.context().pages()) {
        const title = await p.title().catch(() => '');
        const url = p.url();
        const hit = exact
          ? title === match || url === match
          : title.includes(match) || url.includes(match);
        if (hit) {
          await p.bringToFront();
          return p;
        }
      }
      await this.page.waitForTimeout(200);
    }
    throw new Error(`No window found matching "${match}" within ${timeout}ms`);
  }

  /** Execute up to three steps defined in a menu JSON. */
  public async handlerSteps(menuJson?: MenuJson) {
    if (!menuJson) return;
    if (menuJson.step1) await this.handlerStep(menuJson.step1);
    if (menuJson.step2) await this.handlerStep(menuJson.step2);
    if (menuJson.step3) await this.handlerStep(menuJson.step3);
  }

  /**
   * Open a menu by performing configured steps with retries.
   * - Scrolls to top, (optional) switches to UX shell, waits for loading, runs steps.
   * - If `fileName` is provided, captures a screenshot after step1 target is visible.
   */
  public async openMenu(menuJson: MenuJson, opts: { retryTimes?: number } = {}) {
    let retryTime = opts.retryTimes ?? RETRY_INTERVAL_TIMES;

    while (retryTime > 0) {
      try {
        await this.scrollToTop();
        await this.switchToUxShell(); // no-op by default; override if needed
        await this.waitLoading();
        await this.handlerSteps(menuJson);
        retryTime = 0;
      } catch (err) {
        console.log(new Date(), `retry open menu => ${JSON.stringify(menuJson)}, retryTime=${retryTime}`, err);
        retryTime -= 1;
        if (retryTime === 0) {
          throw new Error(`Cannot open menu => ${JSON.stringify(menuJson)}`);
        }
        await this.scrollToTop();
      }
    }

    if (menuJson.fileName && menuJson.step1?.ele) {
      const first = this.resolveLocator(menuJson.step1.ele);
      await expect(first).toBeVisible({ timeout: ELEMENT_TIMEOUT });
      await this.saveScreen(menuJson.fileName);
    }
  }

  /** Save a full-page screenshot to ./screenshots/<fileName>. */
  public async saveScreen(fileName: string) {
    const outDir = path.resolve(process.cwd(), 'screenshots');
    if (!fs.existsSync(outDir)) {
      fs.mkdirSync(outDir, { recursive: true });
    }
    const filePath = path.resolve(outDir, fileName);
    await this.page.screenshot({ path: filePath, fullPage: true });
    return filePath;
  }

  /** Close the current page (Playwright usually manages lifecycle; call if you own the page). */
  public async dispose(): Promise<void> {
    if (!this.page.isClosed()) {
      await this.page.close();
    }
  }

  /**
   * Load JSON test data from a data directory.
   * - DATA_DIR env var can override default "./data"
   */
  public fetchTestData<T = any>(fileName: string): T {
    const dataDir = process.env.DATA_DIR
      ? path.resolve(process.cwd(), process.env.DATA_DIR)
      : path.resolve(process.cwd(), 'data');

    const filePath = path.join(dataDir, fileName);
    try {
      const raw = fs.readFileSync(filePath, 'utf-8');
      if (!raw) throw new Error('JSON file is empty.');
      return JSON.parse(raw) as T;
    } catch (error) {
      console.log(`Error reading JSON file at: ${filePath}`);
      throw new Error(`fetchTestData failed => ${String(error)}`);
    }
  }

  // ---------------------- Utilities ----------------------

  /** If your app has an explicit "switch to UX shell" step, override this in a subclass. */
  protected async switchToUxShell() {
    // no-op by default
  }

  protected resolveLocator(selector: string): Locator {
    const s = selector.trim();
    return s.startsWith('//') || s.startsWith('(')
      ? this.page.locator(`xpath=${s}`)
      : this.page.locator(s);
  }

  protected async scrollToTop(): Promise<void> {
    await this.page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior }));
  }
}