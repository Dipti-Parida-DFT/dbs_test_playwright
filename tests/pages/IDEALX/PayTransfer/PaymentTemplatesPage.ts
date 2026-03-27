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
  }
  readonly templateMenu: Locator;
  readonly createNewTemplateButton: Locator;
  readonly manageTemplateFilter: Locator;
  readonly makeAPaymentLink: Locator;
}
