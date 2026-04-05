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
    this.viewManagementPayrollTemplateHeader = page.locator('//h1[normalize-space(text())="View Management Payroll Template"]');
    this.cancelButton = page.locator('//button[@name="cancel"]');
    this.firstTemplateCheckbox = page.locator('//input[@id="selectTName0"]/following-sibling::label');
    this.deletebuttonTemplate = page.locator('//button[@name="delete"]');
    this.confirmTemplatesToDeleteHeader = page.locator('//*[normalize-space(text())="Confirm templates to delete"]');
    this.confirmDeletePopupHeader = page.locator('//*[normalize-space(text())="Confirm delete"]');
    this.confirmDeletePopupMessageFor1Template = page.locator('//*[normalize-space(text())="1 template(s) will be permanently deleted."]');
    this.confirmDeletebutton = page.locator('//button[@name="delete" and @id="dialogDelete"]');
    this.templateDeletedPopupLabel = page.locator('//h2[normalize-space(text())="Template(s) deleted"]');
    this.templateDeletedPopupMessage1template = page.locator('//span[normalize-space(text())="1 template(s) has been successfully deleted."]');
    this.okButton = page.locator('//button[@name="dismiss"]');
  }
  readonly templateMenu: Locator;
  readonly createNewTemplateButton: Locator;
  readonly manageTemplateFilter: Locator;
  readonly makeAPaymentLink: Locator;
  readonly templateNameLink: Locator;
  readonly viewManagementPayrollTemplateHeader: Locator;
  readonly cancelButton: Locator;
  readonly firstTemplateCheckbox: Locator;
  readonly deletebuttonTemplate: Locator;
  readonly confirmTemplatesToDeleteHeader: Locator;
  readonly confirmDeletePopupHeader: Locator;
  readonly confirmDeletePopupMessageFor1Template: Locator;
  readonly confirmDeletebutton: Locator;
  readonly templateDeletedPopupLabel: Locator;
  readonly templateDeletedPopupMessage1template: Locator;
  readonly okButton: Locator;
}
