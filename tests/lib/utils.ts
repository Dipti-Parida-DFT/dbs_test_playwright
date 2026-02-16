// utils/playwrightUtils.ts
import { Page, Locator, Frame, BrowserContext, TestInfo, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import { exec as execCb } from 'node:child_process';
import { promisify } from 'node:util';
import moment from 'moment';
import log4js from 'log4js';

const exec = promisify(execCb);

// ─────────────────────────────────────────────────────────────────────────────
// Paths & Files
// ─────────────────────────────────────────────────────────────────────────────

export function getBasePath() {
  return process.cwd();
}

export function getDataPath() {
  return path.join(getBasePath(), 'data');
}

export function copyFile(sourceFile: string, targetFile: string): boolean {
  try {
    fs.copyFileSync(sourceFile, targetFile);
    return true;
  } catch (error) {
    console.log(`Error copying: { ${sourceFile} } -> { ${targetFile} }`);
    console.log(`error => ${error}`);
    return false;
  }
}

export function getFileName(filePath: string) {
  return filePath.split('/').pop() ?? filePath;
}

/**
 * Builds a temp upload file path (with timestamp) under data/tmp and copies source there.
 * Keeps original name for .jpg/.pdf per legacy behavior.
 */
export function getUploadFile(fileName: string) {
  const base = getDataPath();
  const targetFileName = getFileName(fileName);
  const ts = moment(new Date()).format('YYMMDDHHmmsss');
  const sourceFile = path.join(base, fileName);
  let targetFile = path.join(base, 'tmp', `${targetFileName}-${ts}`);

  if (fileName.endsWith('.jpg') || fileName.endsWith('.pdf')) {
    targetFile = path.join(base, 'tmp', targetFileName);
  }
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  const success = copyFile(sourceFile, targetFile);
  return success ? targetFile : null;
}

/** Same as getUploadFile but without timestamp suffix (legacy alias) */
export function getUploadFile2(fileName: string) {
  const base = getDataPath();
  const targetFileName = getFileName(fileName);
  const sourceFile = path.join(base, fileName);
  const targetFile = path.join(base, 'tmp', targetFileName);
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  const success = copyFile(sourceFile, targetFile);
  return success ? targetFile : null;
}

/** Like getUploadFile but inserts timestamp before extension (abc-TS.ext) */
export function getUploadFile3(fileName: string) {
  const base = getDataPath();
  const targetFileName = getFileName(fileName);
  const ts = moment(new Date()).format('YYMMDDHHmmsss');
  const sourceFile = path.join(base, fileName);

  const pos = targetFileName.lastIndexOf('.');
  const ext = pos >= 0 ? targetFileName.substring(pos) : '';
  const withoutExt = pos >= 0 ? targetFileName.substring(0, pos) : targetFileName;

  let targetFile = path.join(base, 'tmp', `${withoutExt}-${ts}${ext}`);
  if (fileName.endsWith('.jpg') || fileName.endsWith('.pdf')) {
    targetFile = path.join(base, 'tmp', targetFileName);
  }
  fs.mkdirSync(path.dirname(targetFile), { recursive: true });
  const success = copyFile(sourceFile, targetFile);
  return success ? targetFile : null;
}

// ─────────────────────────────────────────────────────────────────────────────
/** Join two path-like strings with exactly one slash (legacy addTail) */
export function addTail(part1: string, part2: string) {
  if (part1.endsWith('/') && part2.startsWith('/')) return part1 + part2.substring(1);
  if (!part1.endsWith('/') && !part2.startsWith('/')) return `${part1}/${part2}`;
  return part1 + part2;
}

// Timeouts via environment (legacy getElementTimeOut, etc.)
const MULTIPLIER = Number(process.env.MULTIPLE ?? 1);
export function getElementTimeout() {
  return Number(process.env.ELEMENT_TIMEOUT ?? 10000) * MULTIPLIER;
}
export function getPageCompleteTimeout() {
  return Number(process.env.PAGE_COMPLETE_TIMEOUT ?? 20000) * MULTIPLIER;
}
export function getMenuItemTimeout() {
  return Number(process.env.MENU_ITEM_TIMEOUT ?? 15000) * MULTIPLIER;
}

// ─────────────────────────────────────────────────────────────────────────────
// Logging decorator equivalents (optional; no-op by default)
/**
 * Simple property access logger for classes—use sparingly. (Optional)
 * Usage: @logAccess class MyClass { ... }
 */
export function logAccess<T extends { new (...args: any[]): {} }>(constructor: T) {
  const original = constructor;
  const proto = original.prototype;
  const props = Object.getOwnPropertyNames(proto);

  props.forEach((prop) => {
    if (prop === 'constructor') return;
    const descriptor = Object.getOwnPropertyDescriptor(proto, prop);
    if (!descriptor || (!descriptor.writable && !descriptor.get && !descriptor.set)) return;

    const originalGetter = descriptor.get;
    const originalSetter = descriptor.set;

    Object.defineProperty(proto, prop, {
      get() {
        console.info(`Accessing: ${process.env.currentTestTitle ?? ''} => ${original.name}.${prop}`);
        return originalGetter ? originalGetter.call(this) : descriptor.value;
      },
      set(value: any) {
        console.info(`Setting: ${process.env.currentTestTitle ?? ''} => ${original.name}.${prop} = ${value}`);
        if (originalSetter) originalSetter.call(this, value);
        else (descriptor as any).value = value;
      },
      enumerable: descriptor.enumerable,
      configurable: true,
    });
  });

  return original;
}

// ─────────────────────────────────────────────────────────────────────────────
// Test history & screenshots (Playwright replacement of handlerCase/saveScreen)
// ─────────────────────────────────────────────────────────────────────────────

export enum PROJECT_TYPE {
  CB = 'CB',
  SU = 'SU',
  SSM = 'SSM',
  IDEALX = 'IDEALX',
}

function ensureDir(p: string) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

/**
 * Record test result to test.history/history.<project>.<angularVersion>.csv and
 * capture a screenshot on failure (Playwright version).
 */
export async function recordTestResult(
  testInfo: TestInfo,
  page: Page | undefined,
  project: PROJECT_TYPE = PROJECT_TYPE.CB,
  angularVersion: 'V2' | 'V8' = process.env.ANGULAR_VERSION?.toUpperCase() === 'V8' ? 'V8' : 'V2'
) {
  const caseDate = moment(new Date()).format('DD/MM/YYYY HH:mm:ss');

  
  const segments =
    Array.isArray((testInfo as any).titlePath)
      ? ((testInfo as any).titlePath as string[])
      : typeof (testInfo as any).titlePath === 'function'
      ? (testInfo as any).titlePath()
      : [testInfo.title];

  const suiteTitle = segments.slice(0, -1).join(' › ') || '(root)';

  const caseTitle = testInfo.title;
  const caseStatus = testInfo.status ?? 'unknown';
  const caseTime = testInfo.duration; // ms

  ensureDir('test.history');
  const csvPath = `test.history/history.${project}.${angularVersion}.csv`;
  if (!fs.existsSync(csvPath)) {
    fs.appendFileSync(csvPath, 'Date,TestSuite,TestCase,Duration,Status\n');
  }
  fs.appendFileSync(
    csvPath,
    `${caseDate},${suiteTitle},${escapeCsvField(caseTitle)},${caseTime},${caseStatus}\n`
  );

  if (caseStatus === 'failed' && page) {
    const outDir = 'test.screens';
    ensureDir(outDir);
    const fileName = `${sanitize(suiteTitle)}-${sanitize(caseTitle)}-${angularVersion}.png`;
    const filePath = path.join(outDir, fileName);
    await page.screenshot({ path: filePath, fullPage: true });
    // Attach to Playwright report
    await testInfo.attach('failure-screenshot', { path: filePath, contentType: 'image/png' });
  }
}

function escapeCsvField(field: string) {
  if (field.includes(',')) {
    field = field.replace(/"/g, '""');
    field = `"${field}"`;
  }
  return field;
}
function sanitize(s: string) {
  return s.replace(/[\\/:*?"<>|]/g, '_');
}

/** Simple screenshot helper */
export async function saveScreen(page: Page, fileName: string) {
  if (!fileName.endsWith('.png')) fileName += '.png';
  const dir = 'test.screens';
  ensureDir(dir);
  const filePath = path.join(dir, fileName);
  await page.screenshot({ path: filePath, fullPage: true });
  return filePath;
}

/** Dev watch: wait N ms if DEV=true (legacy devWatch) */
export async function devWatch() {
  if (/^(1|true|yes)$/i.test(process.env.DEV ?? '')) {
    const delay = Number(process.env.CASE_FINISH_DELAY ?? 2000);
    await new Promise((r) => setTimeout(r, delay));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Loading / Spinners (legacy waitForUXLoading / waitForI3Loading)
// ─────────────────────────────────────────────────────────────────────────────

/** Wait until common loading overlays are gone, then wait for network idle */
export async function waitForUXLoading(page: Page, extraSelectors: string[] = []) {
  const selectors = [
    '//ng-busy/div',
    '//*[@id="loadingDiv"]/center/span[@id="retrieveData"]',
    '.ux-loading',
    '.spinner',
    '.mat-progress-spinner',
    '.cdk-overlay-backdrop',
    ...extraSelectors,
  ];
  for (const sel of selectors) {
    const loc = sel.startsWith('/') ? page.locator(`xpath=${sel}`) : page.locator(sel);
    const visible = await loc.first().isVisible({ timeout: 500 }).catch(() => false);
    if (visible) {
      await loc.first().waitFor({ state: 'hidden', timeout: getPageCompleteTimeout() }).catch(() => {});
    }
  }
  await page.waitForLoadState('networkidle');
}

// ─────────────────────────────────────────────────────────────────────────────
// Frames & Windows (tabs)
// ─────────────────────────────────────────────────────────────────────────────

/** Switch to iframe by selector and return the Frame object */
export async function switchToIframe(page: Page, iframeSelector: string): Promise<Frame> {
  const locator = iframeSelector.startsWith('/') ? page.locator(`xpath=${iframeSelector}`) : page.locator(iframeSelector);
  const handle = await locator.elementHandle();
  if (!handle) throw new Error(`Iframe not found: ${iframeSelector}`);
  const frame = await handle.contentFrame();
  if (!frame) throw new Error(`No content frame for: ${iframeSelector}`);
  return frame;
}

/** Bring to front the first page whose title or URL matches. */
export async function switchToWindow(context: BrowserContext, match: string, { exact = false, timeout = 10000 } = {}) {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    for (const p of context.pages()) {
      const title = await p.title().catch(() => '');
      const url = p.url();
      const hit = exact ? title === match || url === match : title.includes(match) || url.includes(match);
      if (hit) {
        await p.bringToFront();
        return p;
      }
    }
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error(`No window found matching "${match}" within ${timeout}ms`);
}

/** Convenience: switch shells similar to legacy helpers */
export async function switchToI3Shell(page: Page) {
  await switchToUXShell(page);
  await switchToIframe(page, '//iframe[@id="old-iframe"]');
}
export async function switchToUXShell(page: Page) {
  // In Playwright you don't "switch" globally; return frame if needed.
  await switchToIframe(page, '//iframe[@id="iframe_top"]');
}
export async function switchToMain(page: Page) {
  // No-op in Playwright—just use page itself (default main frame).
  return page;
}

// ─────────────────────────────────────────────────────────────────────────────
// Query parsing & request helpers
// ─────────────────────────────────────────────────────────────────────────────

/** Parse query string params from a URL into an object */
export function parseUrl(url: string): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {};
  try {
    const u = new URL(url, 'http://localhost');
    for (const [k, v] of u.searchParams.entries()) {
      if (k in out) {
        const prev = out[k];
        out[k] = Array.isArray(prev) ? prev.concat(v) : [prev as string, v];
      } else {
        out[k] = v;
      }
    }
  } catch {
    // Fallback: regex-based parse for malformed urls
    const reg = /[?&]([^=&#]+)=([^&#]*)/g;
    const matches = url.match(reg) ?? [];
    for (const m of matches) {
      const [key, val] = m.replace(/^[?&]/, '').split('=');
      if (key in out) {
        const prev = out[key];
        out[key] = Array.isArray(prev) ? prev.concat(val) : [prev as string, val];
      } else {
        out[key] = val;
      }
    }
  }
  return out;
}

/** Attach current page URL’s qs & subOrgId to a request payload (legacy handleRequestQs) */
export function handleRequestQs(requestData: any, currentUrl: string) {
  const qs = parseUrl(currentUrl);
  if (qs['qs']) requestData.qs = qs['qs'];
  if (qs['subOrgId']) requestData.subOrgId = qs['subOrgId'];
  return requestData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Environment flags (legacy SIT/SUSIT)
// ─────────────────────────────────────────────────────────────────────────────

/** Prefer setting ENV=SIT|UAT in your environment. */
export const SIT = (process.env.ENV?.toUpperCase() === 'SIT') as boolean;

/** SUSIT legacy: detect specific IPs in NEW_SAM_URL */
export const SUSIT = !/(116\.12\.252\.152|10\.92\.154\.117)/.test(process.env.NEW_SAM_URL ?? '');

// ─────────────────────────────────────────────────────────────────────────────
// Formatting & Random
// ─────────────────────────────────────────────────────────────────────────────

export function formatStrToMoney(num: string): string {
  let s = num.replace(/[^0-9]/g, '');
  let result = '';
  while (s.length > 3) {
    result = ',' + s.slice(-3) + result;
    s = s.slice(0, -3);
  }
  if (s) result = s + result;
  return result;
}

export function formatDateToString(date: Date, pattern: string = 'DD MMM YYYY', locale: string = 'en-gb'): string {
  return moment(date.getTime()).locale(locale).format(pattern);
}

/** Random 5-char base36 id (legacy generatedID) */
export function generatedID() {
  return ((Math.random() * Math.pow(36, 5)) << 0).toString(36).slice(-5);
}

export function randomNumbers(length: number = 5) {
  let s = '';
  for (let i = 0; i < length; i++) s += Math.floor(Math.random() * 10);
  return s;
}

export function randomAlphabetAndNumbers(min: number, max?: number) {
  const pool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const range = max ? Math.round(Math.random() * (max - min)) + min : min;
  let out = '';
  for (let i = 0; i < range; i++) {
    out += pool[Math.floor(Math.random() * pool.length)];
  }
  return out;
}

export function getRandomString(length: number) {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let s = '';
  while (s.length < length) s += chars.charAt(Math.floor(Math.random() * chars.length));
  return s;
}

/** Execute a shell command (non-throwing boolean result) */
export async function execCommand(command: string): Promise<boolean> {
  try {
    await exec(command);
    return true;
  } catch (e) {
    console.log(`error when exec command => ${command}`, e);
    return false;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Scrolling (Playwright)
// ─────────────────────────────────────────────────────────────────────────────

export async function scrollToTop(page: Page) {
  await page.evaluate(() => window.scrollTo(0, 0));
}
export async function scrollToBottom(page: Page) {
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
}
export async function scrollTo(page: Page, x: number, y: number) {
  await page.evaluate(([tx, ty]) => window.scrollTo(tx, ty), [x, y]);
}

// ─────────────────────────────────────────────────────────────────────────────
// Data-list & Project enums (legacy)
// ─────────────────────────────────────────────────────────────────────────────

export enum DATALIST_TYPE {
  DEFAULT = 1,
  PAYNOW = 2,
}

// ─────────────────────────────────────────────────────────────────────────────
// Logger (log4js) – cross-platform path
// ─────────────────────────────────────────────────────────────────────────────

log4js.configure({
  appenders: {
    autotest: { type: 'file', filename: path.resolve('logs', 'autotest.log') },
  },
  categories: { default: { appenders: ['autotest'], level: 'info' } },
});

export const logger = log4js.getLogger();