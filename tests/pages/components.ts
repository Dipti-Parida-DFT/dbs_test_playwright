// pages/components.ts
import { Page, Locator, expect } from '@playwright/test';
import * as path from 'node:path';
import * as fs from 'node:fs';

const DEFAULT_TIMEOUT = Number(process.env.ELEMENT_TIMEOUT ?? 15000);

/** Small helper to detect XPath vs CSS */
const isXPath = (sel: string) => sel.trim().startsWith('//') || sel.trim().startsWith('(');

/** Join a base XPath with a tail XPath */
const joinXPath = (base: string, tail: string) => {
  const b = base.trim();
  const t = tail.trim();
  const sep = t.startsWith('/') ? '' : '/';
  return `${b}${sep}${t}`;
};

/** Base component wrapper (formerly WebComponent). */
export class BaseComponent {
  constructor(protected readonly page: Page, public readonly locator: Locator, public readonly selector: string) {}

  /** Default per-action timeout (replaces huoQuChaoShi) */
  protected timeout(): number {
    return DEFAULT_TIMEOUT;
  }

  /** Wait for element to be visible + enabled (clickable) */
  async waitForClickable(timeout = this.timeout()) {
    await expect(this.locator).toBeVisible({ timeout });
    await expect(this.locator).toBeEnabled({ timeout });
  }

  /** Click with safety checks (replaces dianJiElement / click) */
  async click(timeout = this.timeout()) {
    await this.waitForClickable(timeout);
    await this.locator.click();
  }

  /** Click if it exists & is visible (replaces dianJuChunZhai / jsdianJuChunZhai) */
  async clickIfPresent(timeout = 1000) {
    if (await this.locator.isVisible({ timeout }).catch(() => false)) {
      await this.locator.click();
      return true;
    }
    return false;
  }

  /** Force click alternative (replaces elementDianji2 / jsClick) */
  async forceClick(timeout = this.timeout()) {
    await expect(this.locator).toBeVisible({ timeout });
    await this.locator.click({ force: true });
  }

  /** Exists (presence) (replaces ElementExist / isElementChunZai) */
  async exists(timeout = 1000) {
    return await this.locator.isVisible({ timeout }).catch(() => false);
  }

  /** Get text content (replaces huoQuNeiRong) */
  async getText(timeout = this.timeout()) {
    await this.locator.waitFor({ state: 'visible', timeout }).catch(() => {});
    const txt = await this.locator.textContent().catch(() => null);
    if (txt && txt.trim()) return txt.trim();

    // Fallback: read value attribute (if text was empty)
    const val = await this.locator.getAttribute('value').catch(() => null);
    return (val ?? '').trim();
  }

  /** Get value attribute (replaces huoQuZhi) */
  async getValue(timeout = this.timeout()) {
    await this.locator.waitFor({ state: 'attached', timeout }).catch(() => {});
    return (await this.locator.getAttribute('value').catch(() => null)) ?? '';
  }

  /** Get id attribute (replaces huoQuId) */
  async getId(timeout = this.timeout()) {
    await this.locator.waitFor({ state: 'attached', timeout }).catch(() => {});
    return (await this.locator.getAttribute('id').catch(() => null)) ?? '';
  }

  /** Get attribute (replaces huoQuAttribute) */
  async getAttribute(name: string, timeout = this.timeout()) {
    await this.locator.waitFor({ state: 'attached', timeout }).catch(() => {});
    return (await this.locator.getAttribute(name).catch(() => null)) ?? '';
  }

  /** Get tag name (replaces quDeTagName) */
  async getTagName(timeout = this.timeout()) {
    const el = await this.locator.elementHandle();
    if (!el) return '';
    return await el.evaluate((node) => (node as HTMLElement).tagName.toLowerCase());
  }

  /** Selected (replaces isElementXuanZhe) */
  async isSelected(timeout = this.timeout()) {
    await this.locator.waitFor({ state: 'visible', timeout }).catch(() => {});
    const el = await this.locator.elementHandle();
    if (!el) return false;
    return await el.evaluate((node) => (node as HTMLInputElement).checked ?? false);
  }

  /** Add XPath tail to current selector (replaces addTail) */
  addTail(tail: string): string {
    if (!isXPath(this.selector)) {
      // If the base is CSS, just return concatenated CSS (best effort)
      return `${this.selector} ${tail}`;
    }
    return joinXPath(this.selector, tail);
  }

  /** Get a child locator relative to this component’s root (XPath) */
  child(tail: string): Locator {
    if (isXPath(this.selector)) {
      const rel = tail.startsWith('/') ? `.${tail}` : `./${tail}`;
      return this.locator.locator(`xpath=${rel}`);
    }
    // CSS fallback
    return this.locator.locator(tail);
  }

  /** Screenshot (replaces jieTu / saveScreen on element) */
  async screenshot(fileName: string) {
    const outDir = path.resolve(process.cwd(), 'screenshots');
    if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
    const filePath = path.join(outDir, fileName);
    await this.locator.screenshot({ path: filePath });
    return filePath;
  }
}

/** Button component (formerly Button) */
export class Button extends BaseComponent {
  async isDisabled(timeout = this.timeout()) {
    await this.locator.waitFor({ state: 'attached', timeout }).catch(() => {});
    const disabledAttr = await this.locator.getAttribute('disabled');
    // Some frameworks set disabled="true", some just presence
    return disabledAttr === 'true' || disabledAttr === 'disabled' || (await this.locator.isDisabled().catch(() => false));
  }

  async submit() {
    // Playwright does not have .submit(); trigger via click or Enter
    await this.locator.press('Enter').catch(async () => {
      await this.click();
    });
  }
}

/** Radio button group / custom radios (formerly RadioButton) */
export class RadioButton extends Button {
  /**
   * Select a radio whose label contains `labelText`.
   * This is a generic implementation—adjust locators for your DOM if needed.
   */
  async selectByLabel(labelText: string, timeout = this.timeout()) {
    // Try role-based first
    const cand = this.locator.getByRole('radio', { name: new RegExp(labelText, 'i') });
    if (await cand.isVisible({ timeout }).catch(() => false)) {
      await cand.check().catch(async () => cand.click());
      return;
    }

    // Fallback: find a descendant label with text
    const label = this.locator.locator(`xpath=.//label[contains(., "${labelText}")]`);
    if (await label.isVisible({ timeout }).catch(() => false)) {
      await label.click();
      return;
    }

    // Last resort: click the first radio under this group
    const first = this.locator.getByRole('radio').first();
    if (await first.isVisible({ timeout }).catch(() => false)) {
      await first.check().catch(async () => first.click());
    } else {
      throw new Error(`Radio with label "${labelText}" not found under ${this.selector}`);
    }
  }
}

/** Text input / textarea (formerly TextShuRu) */
export class TextInput extends BaseComponent {
  async fill(value: string, timeout = this.timeout()) {
    await expect(this.locator).toBeVisible({ timeout });
    await this.locator.fill(value ?? '');
  }

  async clear(timeout = this.timeout()) {
    await expect(this.locator).toBeVisible({ timeout });
    // Clear via select-all + backspace (works across custom inputs)
    await this.locator.focus();
    await this.locator.press('Control+A').catch(async () => this.locator.press('Meta+A'));
    await this.locator.press('Backspace');
  }

  async valueContains(expected: string, timeout = this.timeout()) {
    await this.locator.waitFor({ state: 'attached', timeout }).catch(() => {});
    const val = await this.getValue();
    return val.trim().includes((expected ?? '').trim());
  }

  async textContains(expected: string, timeout = this.timeout()) {
    const txt = await this.getText(timeout);
    return txt.trim().includes((expected ?? '').trim());
  }
}

/** File input (formerly FileSelect) */
export class FileInput extends TextInput {
  /** Select a file by setting the input's files (Playwright way) */
  async selectFile(filePath: string) {
    const abs = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
    if (!fs.existsSync(abs)) throw new Error(`File does not exist: ${abs}`);
    await this.locator.setInputFiles(abs);
    return abs;
  }
}

/** Native HTML <select> (formerly HtmlSelect) */
export class HtmlSelect extends TextInput {
  async selectByLabel(optionLabel: string, timeout = this.timeout()) {
    await expect(this.locator).toBeVisible({ timeout });
    await this.locator.selectOption({ label: optionLabel });
  }
  async selectByValue(optionValue: string, timeout = this.timeout()) {
    await expect(this.locator).toBeVisible({ timeout });
    await this.locator.selectOption({ value: optionValue });
  }
  async selectFirstNonPlaceholder(timeout = this.timeout()) {
    await expect(this.locator).toBeVisible({ timeout });
    const options = this.locator.locator('option');
    const count = await options.count();
    for (let i = 0; i < count; i++) {
      const txt = (await options.nth(i).textContent())?.trim() ?? '';
      if (txt && !txt.includes('--')) {
        const val = (await options.nth(i).getAttribute('value')) ?? undefined;
        if (val) {
            await this.locator.selectOption(val);
        } else {
            throw new Error(`Invalid value for selectOption: ${val}`);
        }
        return;
      }
    }
    throw new Error(`No non-placeholder option found in ${this.selector}`);
  }
}

/**
 * Typeahead / Auto-complete (formerly OptionSelect)
 * Generic helper: click to open, type filter, press Enter or click first result.
 */
export class AutoCompleteSelect extends TextInput {
  /** Try to find a focused inner input to type into */
  protected innerInput(): Locator {
    // Try a few common patterns
    return this.locator.locator('input, textarea').first();
  }

  async open(timeout = this.timeout()) {
    await this.click(timeout);
  }

  async search(value: string, timeout = this.timeout()) {
    await this.open(timeout);
    const input = this.innerInput();
    if (await input.isVisible({ timeout: 500 }).catch(() => false)) {
      await input.fill(value ?? '');
    } else {
      // Type at root if no inner input
      await this.locator.pressSequentially(value ?? '');
    }
  }

  async chooseFirst(timeout = this.timeout()) {
    // Hit Enter first; commonly selects the first suggestion
    await this.locator.press('Enter').catch(async () => {
      // If Enter fails, try clicking a common suggestion container
      const suggestion = this.locator.locator('.search-result-container, ul[role="listbox"]').locator('xpath=.//div|.//li').first();
      if (await suggestion.isVisible({ timeout: 800 }).catch(() => false)) {
        await suggestion.click();
      }
    });
  }

  async select(displayText: string, timeout = this.timeout()) {
    await this.search(displayText, timeout);
    await this.chooseFirst(timeout);
  }

  async selectFirst(timeout = this.timeout()) {
    await this.open(timeout);
    await this.chooseFirst(timeout);
  }
}

/**
 * Generic date picker (formerly DateSelect)
 * NOTE: Date pickers vary wildly—this provides a best-effort generic helper.
 * Expects a calendar opens on clicking the root and you can click button/span containing DD/MMM/YYYY parts.
 */
export class DatePicker extends AutoCompleteSelect {
  private parsedDate: string[] = [];

  private validate(dateStr: string) {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return false;
    // Keep original tokenization logic (e.g., "23 Mar 2016")
    this.parsedDate = dateStr.split(/\s+/);
    return true;
  }

  protected async pickPart(container: Locator, token: string) {
    // Click a cell/button that contains the token
    const candidate = container.locator(`xpath=.//button[normalize-space(.)="${token}"] | .//span[normalize-space(.)="${token}"] | .//*[contains(normalize-space(.), "${token}")]`).first();
    if (await candidate.isVisible({ timeout: 1500 }).catch(() => false)) {
      await candidate.click();
    } else {
      // As a fallback, press Enter to accept current
      await container.press('Enter').catch(() => {});
    }
  }

  async select(dateDisplay: string, timeout = this.timeout()) {
    if (!this.validate(dateDisplay)) {
      throw new Error(`Invalid date string: "${dateDisplay}". Expected like "23 Mar 2016" or parseable by Date().`);
    }
    await this.open(timeout);

    // Common generic containers
    const calendar = this.locator.locator('xpath=.//ancestor-or-self::*[contains(@class,"calendar") or contains(@class,"datepicker") or contains(@id,"calendar")][1]');
    const container = (await calendar.count()) > 0 ? calendar.first() : this.page.locator('body'); // fallback to page

    // Try Year, Month, Day tokens in that order if present
    const [day, mon, year] = this.parsedDate;
    if (year) await this.pickPart(container as Locator, year);
    if (mon)  await this.pickPart(container as Locator, mon);
    if (day)  await this.pickPart(container as Locator, day);
  }

  /** Month/Year only (formerly select2) */
  async selectMonthYear(dateDisplay: string, timeout = this.timeout()) {
    if (!this.validate(dateDisplay)) {
      throw new Error(`Invalid date string: "${dateDisplay}". Expected like "Mar 2016".`);
    }
    await this.open(timeout);
    const calendar = this.locator.locator('xpath=.//ancestor-or-self::*[contains(@class,"calendar") or contains(@class,"datepicker") or contains(@id,"calendar")][1]');
    const container = (await calendar.count()) > 0 ? calendar.first() : this.page;
    const [mon, year] = this.parsedDate;
    if (year) await this.pickPart(container as Locator, year);
    if (mon)  await this.pickPart(container as Locator, mon);
  }

  async isDisabled(timeout = this.timeout()) {
    const child = this.locator.locator('xpath=.//div//input|.//input');
    await child.waitFor({ state: 'attached', timeout }).catch(() => {});
    const disabled = await child.getAttribute('disabled');
    return disabled === 'true' || disabled === 'disabled' || (await child.isDisabled().catch(() => false));
  }

  async getDate(timeout = this.timeout()) {
    const child = this.locator.locator('xpath=.//div//input|.//input');
    await child.waitFor({ state: 'attached', timeout }).catch(() => {});
    return (await child.getAttribute('value').catch(() => null)) ?? '';
  }
}

/**
 * DBS-style calendar (formerly DBSCalendarSelect)
 * Kept generic since the original relied on very specific DOM. We provide similar API.
 */
export class DBSCalendarSelect extends DatePicker {
  async selectDayOnly(dateDisplay: string, timeout = this.timeout()) {
    // Accepts "DD MMM YYYY" but only picks the day (for popups already set to target month/year)
    if (!(new Date(dateDisplay).toString() !== 'Invalid Date')) {
      throw new Error(`Invalid date string: "${dateDisplay}".`);
    }
    const [day] = dateDisplay.split(/\s+/);
    await this.open(timeout);
    const calendar = this.locator.locator('xpath=.//ancestor-or-self::*[contains(@id,"day-calendar-element") or contains(@class,"calendar")][1]');
    const container = (await calendar.count()) > 0 ? calendar.first() : this.page;
    await this.pickPart(container as Locator, day);
  }
}

/** Table-like list selector (formerly ListSelect) */
export class ListSelect extends AutoCompleteSelect {
  private dataListType: 'DEFAULT' | 'PAYNOW' | 'OTHER' = 'DEFAULT';

  setDataListType(type: 'DEFAULT' | 'PAYNOW' | 'OTHER' = 'DEFAULT') {
    this.dataListType = type;
    return this;
  }

  /** Click rows by 1-based indices */
  async selectByIndices(...indices: number[]) {
    // Heuristic row container
    const rows = this.locator.locator('xpath=.//table/tbody/tr|.//datatable-row-wrapper|.//div[contains(@class,"table")]/div[contains(@class,"row")]');
    const count = await rows.count();
    for (const i of indices) {
      const idx = i - 1;
      if (idx >= 0 && idx < count) {
        const row = rows.nth(idx);
        // Click first focusable control in the row
        const clickable = row.locator('button, input, a, div, span').first();
        await clickable.click();
      }
    }
  }

  /** Select all (when there is a header checkbox) */
  async selectAll(timeout = this.timeout()) {
    // Try common header checkbox patterns
    const headerCheckbox = this.locator.locator('xpath=.//thead//input[@type="checkbox"] | .//thead//div//input[@type="checkbox"]');
    if (await headerCheckbox.isVisible({ timeout }).catch(() => false)) {
      await headerCheckbox.check().catch(async () => headerCheckbox.click());
    } else {
      // Fallback: click header text that might toggle all
      const headerToggle = this.locator.locator('xpath=.//thead//*[contains(@class,"select") or contains(., "Select All")]').first();
      if (await headerToggle.isVisible({ timeout }).catch(() => false)) {
        await headerToggle.click();
      } else {
        throw new Error(`Cannot find Select All control in ${this.selector}`);
      }
    }
  }

  /**
   * Click a button/link in a given column when a specific text appears in that column.
   * (replaces clickWithColAndText)
   */
  async clickInColumnWhereText(colNum: number, textContains: string, textPosition: number = 1, timeout = this.timeout()) {
    const rows = this.locator.locator('xpath=.//table/tbody/tr');
    const total = await rows.count();
    for (let r = 0; r < total; r++) {
      const cell = rows.nth(r).locator(`xpath=.//td[${colNum}]`);
      const btn = cell.locator(`xpath=.//p[${textPosition}]/button | .//button`).first();
      const cellText = (await cell.textContent()) ?? '';
      if (cellText.includes(textContains)) {
        await btn.click();
        return;
      }
    }
    throw new Error(`No row found with text "${textContains}" in column ${colNum}`);
  }

  /** Alert helper: click alert row matching title & account value (replaces selectAlert) */
  async selectAlertRow(titlePart: string, accountPart: string, timeout = this.timeout()) {
    const table = this.locator.locator('xpath=.//table[@id="alerts"]');
    await expect(table).toBeVisible({ timeout });
    const titles = table.locator('xpath=.//tbody//tr//a');
    const rows = await titles.count();
    for (let i = 0; i < rows; i++) {
      const link = titles.nth(i);
      const row = table.locator('xpath=.//tbody//tr').nth(i);
      const accountCell = row.locator('xpath=.//td[2]');
      const t = (await link.textContent()) ?? '';
      const a = (await accountCell.textContent()) ?? '';
      if (t.includes(titlePart) && a.includes(accountPart)) {
        await link.click();
        return;
      }
    }
    throw new Error(`No alert row found with title "${titlePart}" and account "${accountPart}"`);
  }
}

/** Horizontal menu item that may need pre-clicks to become visible (formerly IXHorizontalMenu) */
export class HorizontalMenu extends Button {
  /**
   * Try clicking sibling nav items until this one appears, then click it.
   * Useful for lazy/overflow navs.
   */
  async click(timeout = this.timeout()) {
    // Try immediate click
    if (await this.exists(300)) {
      await super.click(timeout);
      return;
    }

    // Try walking siblings
    const siblings = this.page.locator('xpath=//p-horizontal-navigation/div/ul[2]/li');
    const count = await siblings.count();
    for (let i = 0; i < count; i++) {
      const sibBtn = siblings.nth(i);
      await sibBtn.click().catch(() => {});
      if (await this.exists(300)) break;
    }

    await super.click(timeout);
  }
}

/** Alternate date picker variant (formerly DateSelect1) */
export class DatePickerAlt extends DatePicker {
  // Uses the same generic helpers from DatePicker;
  // If you need exact replica of the multi-step year/month navigation,
  // add app-specific locators here and call pickPart(container, token).
}