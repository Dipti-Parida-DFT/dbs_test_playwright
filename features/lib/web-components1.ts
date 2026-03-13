
/**
 * Playwright refactor of Protractor helpers.
 * Drop-in friendly: preserves most class & method names.
 * Requires: @playwright/test
 */

import { Page, Locator, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

// -----------------------------------------------------------------------------
// Types & small utilities
// -----------------------------------------------------------------------------

export enum DATALIST_TYPE {
  DEFAULT = 'DEFAULT',
  PAYNOW = 'PAYNOW',
  OTHER = 'OTHER',
}

export interface ComponentOptions {
  defaultTimeout?: number; // default 30000
  delays?: {
    default?: number;      // default delay (ms) used by loading()
    multiple?: number;     // multiplier (kept for compatibility)
    button?: number;       // click delay
    optionSelect?: number; // dropdown wait
    datePicker?: number;   // datepicker wait
    listSelect?: number;   // list selection wait
    getOpenSelector?: number; // for OptionSelect.selectCount() delay
  };
  filesRootDir?: string; // base path for file uploads (optional)
}

/**
 * Ensures we treat input as XPath selector.
 * Playwright auto-detects CSS/XPath but being explicit avoids ambiguity.
 */
function xp(page: Page, xpath: string): Locator {
  return page.locator(`xpath=${xpath}`);
}

function nowStamp(): string {
  const d = new Date();
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return `${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}${pad(d.getHours())}${pad(d.getMinutes())}${pad(d.getSeconds())}`;
}

// -----------------------------------------------------------------------------
// Base component
// -----------------------------------------------------------------------------

export class WebComponent {
  protected page: Page;
  public element: Locator;
  public selector: string;
  protected options: Required<ComponentOptions>;

  constructor(page: Page, selector: string, options?: ComponentOptions) {
    this.page = page;
    this.selector = selector;
    this.element = xp(page, selector);

    // defaults similar to Protractor params
    this.options = {
      defaultTimeout: options?.defaultTimeout ?? 30_000,
      delays: {
        default: options?.delays?.default ?? 250,
        multiple: options?.delays?.multiple ?? 1,
        button: options?.delays?.button ?? 200,
        optionSelect: options?.delays?.optionSelect ?? 350,
        datePicker: options?.delays?.datePicker ?? 350,
        listSelect: options?.delays?.listSelect ?? 250,
        getOpenSelector: options?.delays?.getOpenSelector ?? 200,
      },
      filesRootDir: options?.filesRootDir ?? process.cwd(),
    };
  }

  // === Compatibility helpers (names preserved) ===

  public huoQuChaoShi(): number {
    return this.options.defaultTimeout;
  }

  protected delay(kind: keyof NonNullable<ComponentOptions['delays']>): number {
    const d = this.options.delays[kind] ?? 0;
    const m = this.options.delays.multiple ?? 1;
    return Math.max(0, d * m);
  }

  /**
   * Mimic Protractor's "waitForAngular + stalenessOf(//ng-bus)"
   * In Playwright we do best effort: wait for small delay + ng-bus detached if present.
   */
  protected async loading(time: number = this.delay('default') * (this.options.delays.multiple ?? 1)) {
    if (time > 0) {
      await this.page.waitForTimeout(time);
    }
    try {
      const ngBus = xp(this.page, `//ng-bus`);
      // Wait for "staleness" (detached) for a short time if present
      await ngBus.waitFor({ state: 'detached', timeout: 2_000 });
    } catch {
      // ignore if not present or still attached
    }
  }

  // core click with wait
  public async elementDianji(_element: Locator, timeOut: number = this.huoQuChaoShi()) {
    await _element.waitFor({ state: 'visible', timeout: timeOut });
    await _element.click();
    try {
      await this.loading(this.delay('button'));
    } catch (clickErr) {
      // eslint-disable-next-line no-console
      console.log('clickErr =>', clickErr);
    }
  }

  // jsClick equivalence: force click
  public async elementDianji2(_element: Locator, _timeOut: number = this.huoQuChaoShi()) {
    // Forceful click as a JS-click alternative
    await _element.click({ force: true });
    await this.loading(this.delay('button'));
  }

  public async jsClick(timeOut: number = this.huoQuChaoShi()) {
    await this.element.waitFor({ state: 'attached', timeout: timeOut });
    return await this.elementDianji2(this.element, timeOut);
  }

  public async dianJiElement(_element: Locator, timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.elementDianji(_element, timeOut);
    } catch (clickErr) {
      try {
        await this.elementDianji2(_element, timeOut);
      } catch (jsErr) {
        console.error('jsErr => ' + jsErr);
        throw clickErr;
      }
    }
  }

  public async dianJiElement2(_element: Locator, timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.elementDianji2(_element, timeOut);
    } catch (jsErr) {
      console.error('jsErr => ' + jsErr);
      throw jsErr;
    }
  }

  public async click(timeOut: number = this.huoQuChaoShi()) {
    return await this.dianJiElement(this.element, timeOut);
  }

  public async dianJuChunZhai(timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.element.waitFor({ state: 'attached', timeout: timeOut });
      return await this.click(timeOut);
    } catch {
      console.error('element do not exist => ' + this.selector);
    }
  }

  public async jsdianJuChunZhai(timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.element.waitFor({ state: 'attached', timeout: timeOut });
      return await this.jsClick(timeOut);
    } catch {
      console.error('element do not exist => ' + this.selector);
    }
  }

  public async ElementExist(timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.element.waitFor({ state: 'attached', timeout: timeOut });
      return true;
    } catch {
      console.error('element do exist => ' + this.selector);
      return false;
    }
  }

  public async youChuLai(): Promise<boolean> {
    try {
      return await this.element.isVisible();
    } catch {
      return false;
    }
  }

  public async huoQuNeiRong(): Promise<string> {
    const text = (await this.element.textContent())?.trim() ?? '';
    if (text.length === 0) {
      return await this.huoQuZhi();
    }
    return text;
  }

  public async huoQuZhi(): Promise<string> {
    return (await this.element.getAttribute('value')) ?? '';
  }

  public async huoQuId(): Promise<string> {
    return (await this.element.getAttribute('id')) ?? '';
  }

  public async huoQuAttribute(_attrStr: string): Promise<string> {
    return (await this.element.getAttribute(_attrStr)) ?? '';
  }

  public async quDeTagName(): Promise<string> {
    const tag = await this.element.evaluate((el) => el.nodeName.toLowerCase());
    return tag ?? '';
  }

  public async isSubElementChuZai(subLocator: string | Locator): Promise<boolean> {
    try {
      const loc = typeof subLocator === 'string' ? xp(this.page, subLocator) : subLocator;
      return (await loc.count()) > 0;
    } catch {
      return false;
    }
  }

  public async isElementChunZai(): Promise<boolean> {
    try {
      return (await this.element.count()) > 0;
    } catch {
      return false;
    }
  }

  public async isElementXuanZhe(): Promise<boolean> {
    try {
      // Works for <input type="checkbox" | "radio">
      if (await this.element.evaluate((el) => (el as HTMLInputElement).type === 'checkbox' || (el as HTMLInputElement).type === 'radio')) {
        try {
          // locator.isChecked works only for checkbox/radio
          // @ts-ignore
          return await (this.element as any).isChecked?.() ?? false;
        } catch {
          // fallback
        }
      }
      const aria = await this.element.getAttribute('aria-checked');
      if (aria != null) return aria === 'true';
      const checked = await this.element.getAttribute('checked');
      return !!checked;
    } catch {
      return false;
    }
  }

  public async jieTu(elementName: string): Promise<string> {
    const file = `${elementName}_${nowStamp()}.png`;
    await this.element.screenshot({ path: file });
    return path.resolve(file);
  }

  // 拼接 XPath 片段（保留原语义）
  public addTail(_tag: string): string {
    return `${this.selector}/${_tag}`;
  }

  // convenience to wrap find/findAll from original code
  protected find(_selector: string): Locator {
    return xp(this.page, _selector);
  }
  protected findAll(_selector: string): Locator {
    return xp(this.page, _selector);
  }
}

// -----------------------------------------------------------------------------
// Button
// -----------------------------------------------------------------------------

export class Button extends WebComponent {
  public async isDisabled(timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.element.waitFor({ state: 'attached', timeout: timeOut });
      const val = await this.element.getAttribute('disabled');
      return val === 'disabled' || val === '' || val === 'true';
    } catch {
      return false;
    }
  }

  public async click(timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.dianJiElement(this.element, timeOut);
    } catch (clickErr) {
      throw clickErr;
    }
  }

  public async submit(timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.element.waitFor({ state: 'attached', timeout: timeOut });
      // Try native submit if element is a form or inside one
      await this.element.evaluate((el) => {
        const form = (el as HTMLElement).closest('form') as HTMLFormElement | null;
        form?.submit();
      });
      return true;
    } catch {
      // fallback: press Enter if focused element supports it
      try {
        await this.element.press('Enter', { timeout: 2000 });
        return true;
      } catch {
        return false;
      }
    }
  }
}

// -----------------------------------------------------------------------------
// RadioButton
// -----------------------------------------------------------------------------

export class RadioButton extends Button {
  /**
   * Click the radio whose label contains given text (inside the radio group element).
   * Adjust selectors to your DOM (dbs-radio etc.).
   */
  public async select(radio: string, timeOut: number = this.huoQuChaoShi()) {
    await this.element.waitFor({ state: 'attached', timeout: timeOut });

    // Try: any descendant element whose text includes `radio`
    const candidate = this.element.locator(`xpath=.//*[contains(normalize-space(.), ${JSON.stringify(radio)})]`).first();
    if (await candidate.count()) {
      await this.dianJiElement(candidate);
      return;
    }

    // Fallback: try radio inputs with associated labels
    const radios = this.element.locator('xpath=.//input[@type="radio"]');
    const count = await radios.count();
    for (let i = 0; i < count; i++) {
      const r = radios.nth(i);
      const label = r.locator('xpath=ancestor::*[1]//*[self::label or self::span]');
      const ltxt = ((await label.first().textContent()) ?? '').trim();
      if (ltxt.includes(radio)) {
        await this.dianJiElement(r);
        return;
      }
    }
    throw new Error(`Radio option containing "${radio}" not found under ${this.selector}`);
  }
}

// -----------------------------------------------------------------------------
// TextShuRu (TextInput)
// -----------------------------------------------------------------------------

export class TextShuRu extends WebComponent {
  public async ShuRu(text: string, timeOut: number = this.huoQuChaoShi()) {
    await this.element.waitFor({ state: 'attached', timeout: timeOut });
    try {
      await this.element.fill(''); // clear
    } catch (e) {
      console.log('this.element.clear() -> ', e);
    }
    return await this.element.fill(text);
  }

  public async qingChu(timeOut: number = this.huoQuChaoShi()) {
    try {
      await this.element.waitFor({ state: 'visible', timeout: timeOut });
      return await this.element.fill('');
    } catch {
      console.error(this.selector + ' not visible during timeout, skip!');
      return;
    }
  }

  public async valueContains(expected: string, timeOut: number = this.huoQuChaoShi()) {
    await this.element.waitFor({ state: 'attached', timeout: timeOut });
    const textValue = (await this.huoQuZhi()).trim();
    return textValue.includes(expected.trim());
  }

  public async textbaohan(expected: string, timeOut: number = this.huoQuChaoShi()) {
    await this.element.waitFor({ state: 'attached', timeout: timeOut });
    const text = ((await this.element.textContent()) ?? '').trim();
    return text.includes(expected.trim());
  }
}

// -----------------------------------------------------------------------------
// FileSelect
// -----------------------------------------------------------------------------

export class FileSelect extends TextShuRu {
  private resolveFile(fileName: string): string {
    // If absolute, use as is; else resolve from filesRootDir
    const p = path.isAbsolute(fileName) ? fileName : path.join(this.options.filesRootDir, fileName);
    if (!fs.existsSync(p)) {
      throw new Error(`Upload file not found: ${p}`);
    }
    return p;
  }

  public async select(fileName: string, timeOut: number = this.huoQuChaoShi()): Promise<string> {
    const file = this.resolveFile(fileName);
    await this.element.waitFor({ state: 'attached', timeout: timeOut });
    await this.element.setInputFiles(file);
    return file;
  }

  // Optional alternates if your original utils built paths differently:
  public async select2(fileName: string, timeOut: number = this.huoQuChaoShi()): Promise<string> {
    return this.select(fileName, timeOut);
  }

  /** Insert a timestamp before extension, e.g. abc.txt -> abc-20260120124500.txt (if such a file exists) */
  public async select3(fileName: string, timeOut: number = this.huoQuChaoShi()): Promise<string> {
    const ext = path.extname(fileName);
    const base = path.basename(fileName, ext);
    const stamped = `${base}-${nowStamp()}${ext}`;
    const maybe = path.join(path.dirname(fileName), stamped);
    // If exists use stamped, else fall back
    const chosen = fs.existsSync(maybe) ? maybe : fileName;
    return this.select(chosen, timeOut);
  }
}

// -----------------------------------------------------------------------------
// HtmlSelect (native <select>)
// -----------------------------------------------------------------------------

export class HtmlSelect extends TextShuRu {
  private getHtmlOptionSelector(): string {
    return this.addTail('option');
  }

  private getHtmlOptionDisplaySelector(option: string): string {
    return this.addTail(`option[contains(normalize-space(.), ${JSON.stringify(option)})]`);
  }

  public async select(optionDisplay: string, timeOut: number = this.huoQuChaoShi()) {
    // Prefer native selectOption if element is a <select>
    if ((await this.quDeTagName()) === 'select') {
      await this.element.selectOption({ label: optionDisplay });
      return;
    }
    // Fallback to clicking the option node by text (if DOM exposes those options outside)
    await this.dianJiElement(this.find(this.getHtmlOptionDisplaySelector(optionDisplay)), timeOut);
  }

  public async xuanZheDiyi(timeOut: number = this.huoQuChaoShi()) {
    // pick first non-placeholder option
    const options = this.find(this.getHtmlOptionSelector());
    const cnt = await options.count();
    for (let i = 0; i < cnt; i++) {
      const opt = options.nth(i);
      const text = ((await opt.textContent()) ?? '').trim().toLowerCase();
      if (!text.includes('--')) {
        await this.dianJiElement(opt, timeOut);
        return;
      }
    }
    throw new Error(`No valid option found under ${this.selector}`);
  }

  private getHtmlOptionValueSelector(value: string): string {
    return this.addTail(`option[@value=${JSON.stringify(value)}]`);
  }

  public async selectByValue(optionValue: string, timeOut: number = this.huoQuChaoShi()) {
    if ((await this.quDeTagName()) === 'select') {
      await this.element.selectOption({ value: optionValue });
      return;
    }
    await this.dianJiElement(this.find(this.getHtmlOptionValueSelector(optionValue)), timeOut);
  }
}

// -----------------------------------------------------------------------------
// OptionSelect (typeahead/custom dropdown)
// -----------------------------------------------------------------------------

export class OptionSelect extends TextShuRu {
  private getOpenSelector(): string {
    // TODO: Adjust to your DOM
    return this.addTail('div//inpu'); // original had "inpu" – fix to "input" for your UI
  }

  private getSelectSelector(): string {
    // 1st option under ul
    return this.addTail('div/div/ul/li[1]/di'); // original had "di" – likely "div"
  }
  private getSelectSelector2(): string {
    // For variant component
    return this.addTail("div[1]/*/div[@class='search-result-container']/di"); // adjust "di"
  }
  private getSelectSelector3(): string {
    return this.addTail('div/div/di'); // adjust "di"
  }

  private async open(timeOut: number = this.huoQuChaoShi()) {
    await this.dianJiElement(this.find(this.getOpenSelector()), timeOut);
    await this.loading(this.delay('optionSelect'));
  }

  private async search(value: string) {
    const openInput = this.find(this.getOpenSelector());
    if (await openInput.isEnabled()) {
      await openInput.fill(value);
      await this.selectValue();
    } else {
      console.error('Can not select components => ' + this.selector);
    }
  }

  private async selectValue() {
    await this.loading(this.delay('optionSelect'));
    if (await this.element.locator('xpath=.//ul').count()) {
      await this.dianJiElement(this.find(this.getSelectSelector()));
    } else if (await this.element.locator('xpath=.//*[@class="swift-selector"]').count()) {
      await this.dianJiElement(this.find(this.getSelectSelector2()));
    } else {
      await this.dianJiElement(this.find(this.getSelectSelector3()));
    }
  }

  public async select(valueDisplay: string, timeOut: number = this.huoQuChaoShi()) {
    await this.open(timeOut);
    await this.search(valueDisplay);
  }

  public async xuanZheDiyi(timeOut: number = this.huoQuChaoShi()) {
    await this.select('', timeOut);
  }

  // Count sub-option-selects
  public async selectCount(Count: number) {
    await this.loading(this.delay('getOpenSelector'));
    let index = 0;
    const all = this.find(this.getOpenSelector());
    const c = await all.count();
    for (let i = 0; i < c; i++) {
      const row = all.nth(i);
      const sub = row.locator('xpath=.//div[1]//spa'); // adjust "spa" -> "span" in your DOM
      if (await sub.count()) {
        index++;
      }
    }
    if (Count !== index) throw new Error(`Element ${this.selector} count is '${index}'. Expected value count is '${Count}'`);
  }
}

// -----------------------------------------------------------------------------
// DateSelect (generic calendar with year->month->day)
// -----------------------------------------------------------------------------

export class DateSelect extends OptionSelect {
  private ShuRuDate: string[] = [];

  private isValidateDate(dateStr: string) {
    const d = new Date(Date.parse(dateStr));
    if (isNaN(d.getTime())) {
      console.log('wrong date => ', dateStr);
      return false;
    }
    this.ShuRuDate = dateStr.split(' '); // ["DD", "MMM", "YYYY"]
    return true;
  }

  private huoquBaselujin(): string {
    return this.selector;
  }

  private getDatePickerPath(): string {
    return this.huoquBaselujin() + '/dv'; // adjust "dv"
  }
  private getDatePickerInnerPath(): string {
    return this.huoquBaselujin() + '/datepicker-inne'; // adjust
  }
  private getDayPickerPath(): string {
    return this.getDatePickerInnerPath() + '/day-picke'; // adjust
  }
  private getMonthPickerPath(): string {
    return this.getDatePickerInnerPath() + '/month-picke'; // adjust
  }
  private getYearPickerPath(): string {
    return this.getDatePickerInnerPath() + '/year-picke'; // adjust
  }

  private async quxuanzhe(timeOut: number = this.huoQuChaoShi()) {
    await this.loading(this.delay('datePicker'));
    await this.dianJiElement(this.find(this.getDatePickerPath()), timeOut); // open
    // go to year picker
    await this.dianJiElement(this.find(this.getDayPickerPath() + '/table/thead/tr[1]/th[1]'));
    await this.dianJiElement(this.find(this.getMonthPickerPath() + '/table/thead/tr[1]/th[1]'));

    // navigate year ranges
    const y = parseInt(this.ShuRuDate[2], 10);
    let range = (await this.find(this.getYearPickerPath() + '/table/thead/tr/th[1]/button').textContent()) ?? '';
    let [start, end] = range.split(' - ').map((s) => parseInt(s, 10));
    let cycles = 0;

    while ((end < y || start > y) && cycles++ < 5) {
      if (end < y) {
        // next page
        await this.dianJiElement(this.find(this.getYearPickerPath() + '/table/thead/tr/th[2]'));
      } else if (start > y) {
        // prev page (original code might have used different th index)
        await this.dianJiElement(this.find(this.getYearPickerPath() + '/table/thead/tr/th[2]'));
      }
      range = (await this.find(this.getYearPickerPath() + '/table/thead/tr/th[1]/button').textContent()) ?? '';
      [start, end] = range.split(' - ').map((s) => parseInt(s, 10));
    }
  }

  private async xuanzheYMD(pathExpr: string, value: string) {
    const cells = this.find(pathExpr + "/table/tbody/*/*/button/span[not(contains(@class,'text-muted'))]");
    const cnt = await cells.count();
    for (let i = 0; i < cnt; i++) {
      const c = cells.nth(i);
      const txt = ((await c.textContent()) ?? '').trim();
      if (txt.includes(value)) {
        await this.dianJiElement(c);
        return;
      }
    }
    throw new Error(`Value "${value}" not found under ${pathExpr}`);
  }

  private async xuanzheYear() {
    await this.xuanzheYMD(this.getYearPickerPath(), this.ShuRuDate[2]);
  }

  private async xuanZheMonth() {
    await this.xuanzheYMD(this.getMonthPickerPath(), this.ShuRuDate[1]);
  }

  private async xuanZheDay() {
    await this.xuanzheYMD(this.getDayPickerPath(), this.ShuRuDate[0]);
  }

  public async select(dateDisplay: string, timeOut: number = this.huoQuChaoShi()) {
    // "DD MMM YYYY" e.g., "23 Mar 2016"
    if (this.isValidateDate(dateDisplay)) {
      await this.quxuanzhe(timeOut);
      await this.xuanzheYear();
      await this.xuanZheMonth();
      await this.xuanZheDay();
    }
  }

  /** Month/Year selection only */
  public async select2(dateDisplay: string, timeOut: number = this.huoQuChaoShi()) {
    // "MMM YYYY"
    if (this.isValidateDate(dateDisplay)) {
      await this.quxuanzhe(timeOut);
      await this.xuanzheYear();
      await this.xuanZheMonth();
    }
  }

  public async isDisable(): Promise<boolean> {
    await this.loading();
    const childShuRu = this.find(this.selector + '/div/ShuRu'); // adjust "ShuRu"
    const dis = await childShuRu.getAttribute('disabled');
    return dis === 'true' || dis === '' || dis === 'disabled';
    }

  public async getDate(): Promise<string> {
    const childShuRu = this.find(this.selector + '/div/ShuRu'); // adjust "ShuRu"
    return (await childShuRu.getAttribute('value')) ?? '';
  }
}

// -----------------------------------------------------------------------------
// ListSelect (table-based multi-select patterns)
// -----------------------------------------------------------------------------

export class ListSelect extends OptionSelect {
  private _dataListType: DATALIST_TYPE = DATALIST_TYPE.DEFAULT;

  private getSelectAllPath() {
    switch (this._dataListType) {
      case DATALIST_TYPE.DEFAULT:
        return this.addTail('/div/div[1]/table/thead/tr/th[1]/div/ShuRu'); // adjust "ShuRu"
      case DATALIST_TYPE.PAYNOW:
        return this.addTail('/div/div[2]/table/thead/tr/th[1]/ShuRu');
      default:
        return this.addTail('/div/div[2]/table/thead/tr/th[4]/div/ShuRu');
    }
  }

  private getSelectListPath() {
    switch (this._dataListType) {
      case DATALIST_TYPE.DEFAULT:
        return this.addTail('/div/div[3]/table/tbody/tr');
      case DATALIST_TYPE.PAYNOW:
        return this.addTail('/div/div/div[2]/table/tbody/tr');
      default:
        return this.addTail('/div/div[2]/table/tbody/tr');
    }
  }

  public setDataListType(_typeList: DATALIST_TYPE = DATALIST_TYPE.DEFAULT) {
    this._dataListType = _typeList;
    return this;
  }

  /*public async select(...args: number[]) {
    await this.loading(this.delay('listSelect'));
    let index = 1;
    const rows = this.find(this.getSelectListPath());
    const cnt = await rows.count();
    for (let i = 0; i < cnt; i++) {
      const row = rows.nth(i);
      const sub = row.locator('xpath=.//td[1]/div');
      if (await sub.count()) {
        if (args.includes(index)) {
          await this.dianJiElement(sub);
        }
      }
      index++;
    }
  }*/

  // public async selectWithTimeOut(timeOut: number = this.huoQuChaoShi(), ...args: number[]) {
  //   await this.find(this.getSelectListPath()).waitFor({ state: 'attached', timeout: timeOut });
  //   await this.select(...args);
  // }

  private getSelectListFilePath() {
    return this.addTail('/datatable-row-wrapper');
  }

  public async selectFile(...args: number[]) {
    await this.loading(this.delay('listSelect'));
    let index = 1;
    const rows = this.find(this.getSelectListFilePath());
    const cnt = await rows.count();
    for (let i = 0; i < cnt; i++) {
      const row = rows.nth(i);
      const sub = row.locator('xpath=.//datatable-body-cell[1]//*[@class="checkedBox"]');
      if (await sub.count()) {
        if (args.includes(index)) {
          await this.dianJiElement(sub);
        }
      }
      index++;
    }
  }

  public async selectIdealxFile(...args: number[]) {
    await this.loading(this.delay('listSelect'));
    let index = 1;
    const rows = this.find(this.getSelectListFilePath());
    const cnt = await rows.count();
    for (let i = 0; i < cnt; i++) {
      const row = rows.nth(i);
      const sub = row.locator('xpath=.//datatable-body-cell[1]//ShuRu[@type="checkbox"]'); // adjust "ShuRu"
      if (await sub.count()) {
        if (args.includes(index)) {
          await this.dianJiElement2(sub); // force
        }
      }
      index++;
    }
  }

  public async selectFileTxn(...args: number[]) {
    await this.loading(this.delay('listSelect'));
    let index = 1;
    const rows = this.find(this.getSelectListFilePath());
    const cnt = await rows.count();
    for (let i = 0; i < cnt; i++) {
      const row = rows.nth(i);
      const sub = row.locator('xpath=.//datatable-body-cell[1]/div');
      if (await sub.count()) {
        if (args.includes(index)) {
          await this.dianJiElement(sub);
        }
      }
      index++;
    }
  }

  public async selectFileWithTimeOut(timeOut: number = this.huoQuChaoShi(), ...args: number[]) {
    await this.find(this.getSelectListFilePath()).waitFor({ state: 'attached', timeout: timeOut });
    await this.selectFile(...args);
  }

  public async selectAll(timeOut: number = this.huoQuChaoShi()) {
    await this.loading(this.delay('listSelect'));
    await this.dianJiElement(this.find(this.getSelectAllPath()), timeOut);
  }

  public async clickWithColAndText(colNum: number, textContain: string, textPosition: number = 1, timeOut: number = this.huoQuChaoShi()) {
    await this.element.waitFor({ state: 'attached', timeout: timeOut });

    const rows = this.find(this.getSelectListPath());
    const cnt = await rows.count();
    for (let i = 1; i <= cnt; i++) {
      const selector = `${this.getSelectListPath()}[${i}]/td[${colNum}]/div/p[${textPosition}]/button`;
      const loc = this.find(selector);
      try {
        await loc.waitFor({ state: 'attached', timeout: timeOut });
        const text = ((await loc.textContent()) ?? '');
        if (text.includes(textContain)) {
          await this.dianJiElement(loc);
          return;
        }
      } catch {
        // continue
      }
    }
  }

  public async selectAlert(_title: string, _value: string) {
    const titleLinks = this.find('//table[@id="alerts"]/tbody/*/*/a');
    const cnt = await titleLinks.count();
    const matches: Locator[] = [];

    for (let i = 0; i < cnt; i++) {
      const link = titleLinks.nth(i);
      const t = ((await link.textContent()) ?? '');
      if (t.includes(_title)) {
        // cross check same row second column text
        const row = link.locator('xpath=ancestor::tr[1]');
        const td2 = row.locator('xpath=./td[2]');
        const acctValue = ((await td2.textContent()) ?? '');
        if (acctValue.includes(_value)) {
          matches.push(link);
        }
      }
    }

    if (matches.length) {
      await this.dianJiElement(matches[0]);
    }
  }
}

// -----------------------------------------------------------------------------
// IXHorizontalMenu
// -----------------------------------------------------------------------------

export class IXHorizontalMenu extends Button {
  public async click(timeOut: number = this.huoQuChaoShi()) {
    try {
      let index = 2;
      while (!(await this.isElementChunZai())) {
        await this.dianJiElement(this.find(`//p-horizontal-navigation/div/ul[2]/li[${index++}]`), timeOut);
      }
      await this.dianJiElement(this.element, timeOut);
    } catch (clickErr) {
      throw clickErr;
    }
  }
}
