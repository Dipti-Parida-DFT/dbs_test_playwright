import { Page, Locator } from '@playwright/test';

/**
 * Utility class providing common methods for test automation
 */
export class TestUtils {
  constructor(private readonly page: Page, private readonly defaultTimeout = 30_000) {}

  /**
   * Navigate to a specific URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  /**
   * Navigate back to the previous page
   */
  async goBack(): Promise<void> {
    await this.page.goBack();
  }

  /**
   * Navigate forward to the next page
   */
  async goForward(): Promise<void> {
    await this.page.goForward();
  }

  /**
   * Reload the current page
   */
  async reload(): Promise<void> {
    await this.page.reload();
  }

  /**
   * Get the current URL
   */
  async getCurrentUrl(): Promise<string> {
    return this.page.url();
  }

  /**
   * Get the current page title
   */
  async getPageTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for a specific amount of time
   */
  async wait(ms: number): Promise<void> {
    await this.page.waitForTimeout(ms);
  }

  /**
   * Wait for an element to be visible
   */
  async waitForElementVisible(locator: Locator, timeout = this.defaultTimeout): Promise<void> {
    await locator.waitFor({ state: 'visible', timeout });
  }

  /**
   * Wait for an element to be hidden
   */
  async waitForElementHidden(locator: Locator, timeout = this.defaultTimeout): Promise<void> {
    await locator.waitFor({ state: 'hidden', timeout });
  }

  /**
   * Check if an element is visible
   */
  async isElementVisible(locator: Locator): Promise<boolean> {
    try {
      await locator.isVisible({ timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Check if an element exists on the page
   */
  async elementExists(locator: Locator): Promise<boolean> {
    try {
      await locator.first().waitFor({ state: 'attached', timeout: 5000 });
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get text content from a locator
   */
  async getElementText(locator: Locator): Promise<string> {
    await this.waitForElementVisible(locator);
    return await locator.textContent() || '';
  }

  /**
   * Get the count of elements matching a locator
   */
  async getElementCount(locator: Locator): Promise<number> {
    return await locator.count();
  }

  /**
   * Get attribute value from an element
   */
  async getAttribute(locator: Locator, attributeName: string): Promise<string | null> {
    await this.waitForElementVisible(locator);
    return await locator.getAttribute(attributeName);
  }

  /**
   * Check if element has a specific CSS class
   */
  async hasClass(locator: Locator, className: string): Promise<boolean> {
    const classes = await this.getAttribute(locator, 'class');
    return classes?.includes(className) || false;
  }

  /**
   * Get all matching elements as an array
   */
  async getAllElements(locator: Locator): Promise<Locator[]> {
    const count = await this.getElementCount(locator);
    const elements: Locator[] = [];
    for (let i = 0; i < count; i++) {
      elements.push(locator.nth(i));
    }
    return elements;
  }

  /**
   * Scroll element into view
   */
  async scrollIntoView(locator: Locator): Promise<void> {
    await locator.scrollIntoViewIfNeeded();
  }

  /**
   * Focus on an element
   */
  async focusElement(locator: Locator): Promise<void> {
    await locator.focus();
  }

  /**
   * Hover over an element
   */
  async hoverElement(locator: Locator): Promise<void> {
    await this.scrollIntoView(locator);
    await locator.hover();
  }

  /**
   * Double-click on an element
   */
  async doubleClick(locator: Locator): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.dblclick();
  }

  /**
   * Right-click on an element
   */
  async rightClick(locator: Locator): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.click({ button: 'right' });
  }

  /**
   * Clear text from an input element
   */
  async clearInput(locator: Locator): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.clear();
  }

  /**
   * Select an option from a dropdown by value
   */
  async selectDropdownOption(locator: Locator, value: string): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.selectOption(value);
  }

  /**
   * Select a checkbox
   */
  async checkCheckbox(locator: Locator): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.check();
  }

  /**
   * Uncheck a checkbox
   */
  async uncheckCheckbox(locator: Locator): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.uncheck();
  }

  /**
   * Check if a checkbox is checked
   */
  async isCheckboxChecked(locator: Locator): Promise<boolean> {
    await this.waitForElementVisible(locator);
    return await locator.isChecked();
  }

  /**
   * Take a screenshot of the entire page
   */
  async takeScreenshot(filename: string): Promise<void> {
    await this.page.screenshot({ path: filename, fullPage: true });
  }

  /**
   * Take a screenshot of a specific element
   */
  async takeElementScreenshot(locator: Locator, filename: string): Promise<void> {
    await this.waitForElementVisible(locator);
    await locator.screenshot({ path: filename });
  }

  /**
   * Switch to a specific iframe
   */
  async switchToFrame(locator: Locator): Promise<void> {
    const frameHandle = await locator.elementHandle();
    if (frameHandle) {
      const frame = await frameHandle.contentFrame();
      if (frame) {
        // Return the frame for further operations
        return;
      }
    }
  }

  /**
   * Get page source/HTML
   */
  async getPageSource(): Promise<string | null> {
    return await this.page.content();
  }

  /**
   * Execute JavaScript on the page
   */
  async executeScript<T>(script: string | Function, ...args: unknown[]): Promise<T> {
    return await this.page.evaluate('script', ...args);
  }

  /**
   * Clear all cookies
   */
  async clearCookies(): Promise<void> {
    await this.page.context().clearCookies();
  }

  /**
   * Get all cookies
   */
  async getAllCookies() {
    return await this.page.context().cookies();
  }

  /**
   * Add a cookie
   */
  async addCookie(name: string, value: string, domain?: string): Promise<void> {
    await this.page.context().addCookies([
      {
        name,
        value,
        url: this.page.url(),
        domain: domain || new URL(this.page.url()).hostname,
      },
    ]);
  }

  /**
   * Press a keyboard key
   */
  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  /**
   * Type text with keyboard
   */
  async typeText(text: string, delay?: number): Promise<void> {
    await this.page.keyboard.type(text, { delay });
  }

  /**
   * Drag and drop from one element to another
   */
  async dragAndDrop(sourceLocator: Locator, targetLocator: Locator): Promise<void> {
    await this.waitForElementVisible(sourceLocator);
    await this.waitForElementVisible(targetLocator);
    await sourceLocator.dragTo(targetLocator);
  }

  /**
   * Wait for navigation to complete
   */
  async waitForNavigation(): Promise<void> {
    await this.page.waitForNavigation();
  }

  /**
   * Check if element is enabled
   */
  async isElementEnabled(locator: Locator): Promise<boolean> {
    return await locator.isEnabled();
  }

  /**
   * Get inner HTML of an element
   */
  async getInnerHTML(locator: Locator): Promise<string> {
    await this.waitForElementVisible(locator);
    return (await locator.innerHTML()) || '';
  }
}
