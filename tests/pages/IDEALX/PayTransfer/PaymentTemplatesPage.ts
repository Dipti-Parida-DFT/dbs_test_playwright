/**
  * Author: LC5741501
  * Created Date: 27/03/2026
  * Class path "tests\pages\IDEALX\PayTransfer\PaymentTemplatesPage.ts"
  * Description: This Class contains the locator and methods related to
  * Payment Templates Page.
  */
import { Page, Locator, expect } from '@playwright/test';

export class PaymentTemplatesPage {
  constructor(private readonly page: Page) {
    this.templateMenu = page.locator('//a[contains(@href,"#/transfers/manage-templates")]');
    this.createNewTemplateButton = page.locator('//*[@name="create-new-template"]');
    this.manageTemplateFilter = page.locator('//input[@name="manage-template-filter"]');
    this.makeAPaymentLink = page.locator('//a[@id="template-list-makeAPayment_0"]');
    this.templateNameLink = page.locator('//a[@id="template-list-templateName_0"]');
    this.dimissButton = page.locator('//button[@name="dismiss"]');
    this.templateRefMsG = page.locator('//p[@id="dialogMessage"]');
  } 

  readonly templateMenu: Locator;
  readonly createNewTemplateButton: Locator;
  readonly manageTemplateFilter: Locator;
  readonly makeAPaymentLink: Locator;
  readonly templateNameLink: Locator;
  readonly dimissButton: Locator;
  readonly templateRefMsG: Locator;

    /**
     * Returns the raw banner text (trimmed). If you only need EBLV…,
     * use getReferenceToken() below.
     */
    async getTemplateReferenceText(): Promise<string> {
      const raw = await this.templateRefMsG.textContent();
      return (raw ?? '').trim();
    }
  
    //Extract reference ID
    async getTemplateReferenceId(): Promise<string> {
      const raw = await this.getTemplateReferenceText();
      const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
      return match?.[1] ?? '';
    }

}
