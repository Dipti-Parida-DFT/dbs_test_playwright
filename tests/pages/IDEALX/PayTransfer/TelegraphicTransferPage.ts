// pages/TelegraphicTransferPage.ts
import { Page, Locator, expect, test } from '@playwright/test';

export type BankChargeType = 'SHARED' | 'OUR' | 'THEY';
export type NewTTPayeeInput = {
  name: string;
  nickName: string;
  add1: string;
  add2: string;
  city: string;
  bankId: string;
  routingCode: string;
  accountNumber: string;
  intermediaryBankLocation: string;
  intermediaryBankId: string;
  bankChargeType: BankChargeType;
  purposeCode: string;
  payeeBankMsg: string;
  email1: string
  email2: string
  email3: string
  email4: string
  email5: string
  payeeMsg: string;
  additionalNote: string;
  remitterIdentity: string;
};


export type NewTTPayeeResult = {
  name: string;
  nickName: string;
  add1: string;
  add2: string;
  city: string;
  bankId: string;
  routingCode: string;
  accountNumber: string;
  intermediaryBankLocation: string;
  intermediaryBankId: string;
  purposeCode: string;
  payeeBankMsg: string;
  email1: string
  email2: string
  email3: string
  email4: string
  email5: string
  payeeMsg: string;
  additionalNote: string;
  remitterIdentity: string;
};

export type ExistingTTPayeeInput = {
  existingAccountNumber: string;
  bankChargeType: BankChargeType;
  payeeBankMsg: string;
  email1: string
  email2: string
  email3: string
  email4: string
  email5: string
  payeeMsg: string;
  additionalNote: string;
  remitterIdentity: string;
};


export type ExistingTTPayeeResult = {
  existingAccountNumber: string;
  payeeBankMsg: string;
  email1: string
  email2: string
  email3: string
  email4: string
  email5: string
  payeeMsg: string;
  additionalNote: string;
  remitterIdentity: string;
};


export class TelegraphicTransferPage {
  constructor(private readonly page: Page) {
    this.authenticate = page.locator('//button[@type="button" and @class="btn btn__primary"]');
    this.makePayment = page.locator('//mat-icon[@id="icon__make_payment"]');
    this.MYRcurrency = page.locator('//span[text()="MYR"]');
    this.tranferCenterFiler = page.locator('//*[@id="transferCenter-filter"]');
    this.fromAccount = page.locator('//input[@id="fromAccount"]');
    this.amountInput = page.locator('//input[@name="send-amount"]')
    this.newPayeeTab = page.locator('//a[@id="ux-tab-NEW"]');
    this.cognitiveContinue = page.locator('//button[@id="cognitive-continue"]');
    this.enterNewPayeeBankID = page.locator('//input[@name="new-payee-bank-id"]');
    this.newTTPayeeName = page.locator('//textarea[@name="new-payee-name"]');
    this.newTTPayeeNickname = page.locator('//input[@name="new-payee-nick-name"]');
    this.newTTPayeeAddress1 = page.locator('//input[@name="new-payee-add1"]');
    this.newTTPayeeAddress2 = page.locator('//input[@name="new-payee-add2"]');
    this.findTTBankIDButton = page.locator('//*[@id="new-payee-bank-id-button"]');
    this.bankIDRadioButton = page.locator('//span[contains(text(),"AOFMMYK0XXX")]');
    this.inputRoutingNumber = page.locator('//input[@name="new-payee-routing-code"]');
    this.newTTPayeeAccountNumber = page.locator('//input[@name="new-payee-acct-number"]');
    this.payeeLocation = page.locator('//input[@id="payee-location"]');
    this.MYRlocation = page.locator('//span[text()=" MALAYSIA (MY) "]')
    this.newPayeeCity = page.locator('//input[@name="townCity"]');
    this.intermediaryBankCheckbox = page.locator('//input[@id="isIntermediary"]');
    this.intermediaryBankLocation = page.locator('//input[@id="intermediary-country"]');
    this.intermediaryMYRLocation = page.locator('//span[text()="MALAYSIA"]');
    this.intermediaryBankId = page.locator('//input[@name="intermediary-bank-id"]');
    this.findIntermediaryBankIDButton = page.locator('//input[@id="intermediary-bank-id-button"]');
    this.bankChargesOurRadioButton = page.locator('//input[@id="bank-charge-us"]');
    this.bankChargesSharedRadioButton = page.locator('//input[@id="bank-charge-shared"]');
    this.bankChargesTheyRadioButton = page.locator('//input[@id="bank-charge-they"]');
    this.newTTPurposeCode = page.locator('//input[@name="purposeCode"]');
    this.inputNewTTPurposeCode = page.locator('//input[@placeholder="Purpose code number or description"]');
    this.newTTPurposeCodeSelect = page.locator('//span[contains(text(),"04000 - Animal and vegetable oils, fat and waxes")]');
    this.newTTPaymentRemark = page.locator('//textarea[@name="paymentDetail"]');
    this.newTTPayeeMsgCheckbox = page.locator('//input[@id="isBeneAdvising"]');
    this.newTTPayeeEmail1 = page.locator('//input[@name="email-id-0"]');
    this.newTTPayeeEmail2 = page.locator('//input[@name="email-id-1"]');
    this.newTTPayeeEmail3 = page.locator('//input[@name="email-id-2"]');
    this.newTTPayeeEmail4 = page.locator('//input[@name="email-id-3"]');
    this.newTTPayeeEmail5 = page.locator('//input[@name="email-id-4"]');
    this.newTTPayeeRemark = page.locator('//textarea[@name="adviceContent"]');
    this.additionalNoteCheckbox = page.locator('//input[@id="isTransactionNote"]');
    this.additionalNoteRemark = page.locator('//textarea[@name="transactionNote"]');
    this.orderingBankMsg = page.locator('//textarea[@name="messageToOrderingBank"]');
    this.newTTPayeeNextButton = page.locator('//button[@name="next"]');
    this.newTTsubmitButton = page.locator('//button[@name="submit"]');
    this.newTTfinishButton = page.locator('//button[@name="finish"]');
    this.MYRcontinue = page.locator('//button[@name="continue"]');
    this.newTTreferenceID = page.locator('//label[contains(text(),"Telegraphic Transfer")]');
    this.newTTHashValueLabel = page.locator('//span[@id="ott-view-hashValue"]');
    this.newTTFromAccountViewLabel = page.locator('//span[@id="view-ott-accountNum"]');
    this.newTTPayeeBankLocationLabel = page.locator('//span[@id="ott-view-payee-countryName"]');
    this.newTTPaymentRefLabel = page.locator('//span[@id="ott-view-custRef"]');
    this.newTTRefStatusLabel = page.locator('//div[@id="ott-view-status"]');

    this.existingPayeeTab = page.locator('//a[@id="ux-tab-EXISTING"]');
    this.existingPayeeBankAccount = page.locator('//input[@id="existing-payee"]');
    this.existingPayeeBankAccountSelect = page.locator('//span[contains(text(),"AONEHKH0XXX")]');
    this.existingPayeeBankAccountDropdown = page.locator('//span[contains(text(),"03030303")]');
    this.SGDcurrency = page.locator('//span[text()="SGD"]');
    this.ttApproveNowCheckBox = page.locator('//input[@id="approveNow"]');
    this.ttAlternativeApproveNowCheckBox = page.locator('//*[@*="ic-expand"]');
    this.ttGetChallengeSMSButton = page.locator('//button[@name="get-challenge"]');
    this.ttGetChallengeInput = page.locator('//input[@name="responseCode"]');

    this.ttSaveAsTemplateCheckbox = page.locator('//input[@id="saveAsTemplate"]');
    this.ttSaveAsTemplateInput = page.locator('//input[@name="templateName"]');
    this.templateMenu = page.locator('//a[@*="/transfers/manage-templates"]');
    this.templateFilter = page.locator('//input[@id="manage-template-filter"]');
    this.templateLink = page.locator('//a[@id="template-list-templateName_0"]');
    this.templateAmount = page.locator('(//div[@class="show-template-grey"])[1]');
    this.templateMakeAPaymentButton = page.locator('//a[@id="template-list-makeAPayment_0"]');

    this.ttSaveAsDraftButton = page.locator('//button[@name="save-as-draft"]');
    this.ttSaveAsDraftSuccessMessage = page.locator('//*[@role="dialog"]');
    this.ttSaveAsDraftReferenceID = page.locator('//span[@id="dialogMessageContent"]');
    this.ttSaveAsDraftDismissButton = page.locator('//button[@name="dismiss"]');

    this.ttCopyPaymentButton = page.locator('//button[@name="copy"]');
    this.ttEditPaymentButton = page.locator('//div[@id="ott-view-edit"]');
    this.ttRejectPaymentButton = page.locator('//button[@name="reject"]');
    this.ttRejectPaymentSuccessMessage = page.locator('//div[contains(@class,"prompt-dialog")]');
    this.ttRejectPaymentReasonInput = page.locator('//input[@name="reasonForRejection"]');
    this.ttRejectPaymentSuccessButton = page.locator('//button[contains(@class,"btn__primary medium") and @name="reject"]');

    }

    readonly authenticate: Locator;
    readonly MYRcurrency: Locator;
    readonly tranferCenterFiler: Locator;
    readonly fromAccount: Locator;
    readonly newPayeeTab: Locator;
    readonly cognitiveContinue: Locator;
    readonly enterNewPayeeBankID: Locator;
    readonly makePayment: Locator;
    readonly amountInput: Locator;
    readonly newTTPayeeName: Locator;
    readonly newTTPayeeAddress1: Locator;
    readonly newTTPayeeAddress2: Locator;
    readonly findTTBankIDButton: Locator;
    readonly bankIDRadioButton: Locator;
    readonly inputRoutingNumber: Locator;
    readonly newTTPayeeAccountNumber: Locator;
    readonly newTTPayeeNickname: Locator;
    readonly payeeLocation: Locator;
    readonly MYRlocation: Locator;
    readonly newPayeeCity: Locator;
    readonly intermediaryBankCheckbox: Locator;
    readonly intermediaryBankLocation: Locator;
    readonly intermediaryMYRLocation: Locator;
    readonly intermediaryBankId: Locator;
    readonly findIntermediaryBankIDButton: Locator;
    readonly bankChargesOurRadioButton: Locator;
    readonly bankChargesSharedRadioButton: Locator;
    readonly bankChargesTheyRadioButton: Locator;
    readonly newTTPurposeCode: Locator;
    readonly inputNewTTPurposeCode: Locator;
    readonly newTTPurposeCodeSelect: Locator;
    readonly newTTPaymentRemark: Locator;
    readonly newTTPayeeMsgCheckbox: Locator;
    readonly newTTPayeeEmail1: Locator;
    readonly newTTPayeeEmail2: Locator;
    readonly newTTPayeeEmail3: Locator;
    readonly newTTPayeeEmail4: Locator;
    readonly newTTPayeeEmail5: Locator;
    readonly newTTPayeeRemark: Locator;
    readonly additionalNoteCheckbox: Locator;
    readonly additionalNoteRemark: Locator;
    readonly orderingBankMsg: Locator;
    readonly newTTPayeeNextButton: Locator;
    readonly newTTsubmitButton: Locator;
    readonly newTTfinishButton: Locator;
    readonly MYRcontinue: Locator;
    readonly newTTreferenceID: Locator;
    readonly newTTHashValueLabel: Locator;
    readonly newTTFromAccountViewLabel: Locator;
    readonly newTTPayeeBankLocationLabel: Locator;
    readonly newTTPaymentRefLabel: Locator;
    readonly newTTRefStatusLabel: Locator;

    readonly existingPayeeTab: Locator;
    readonly existingPayeeBankAccount: Locator;
    readonly existingPayeeBankAccountSelect: Locator;
    readonly existingPayeeBankAccountDropdown: Locator;
    readonly SGDcurrency: Locator;
    readonly ttApproveNowCheckBox: Locator;
    readonly ttAlternativeApproveNowCheckBox: Locator;
    readonly ttGetChallengeSMSButton: Locator;
    readonly ttGetChallengeInput: Locator;
    
    readonly ttSaveAsTemplateCheckbox: Locator;
    readonly ttSaveAsTemplateInput: Locator;
    readonly templateMenu: Locator;
    readonly templateFilter: Locator;
    readonly templateLink: Locator;
    readonly templateAmount: Locator;
    readonly templateMakeAPaymentButton: Locator;

    readonly ttSaveAsDraftButton: Locator;
    readonly ttSaveAsDraftSuccessMessage: Locator;
    readonly ttSaveAsDraftReferenceID: Locator;
    readonly ttSaveAsDraftDismissButton: Locator;

    readonly ttCopyPaymentButton: Locator;
    readonly ttEditPaymentButton: Locator;
    readonly ttRejectPaymentButton: Locator;
    readonly ttRejectPaymentSuccessMessage: Locator;
    readonly ttRejectPaymentReasonInput: Locator;
    readonly ttRejectPaymentSuccessButton: Locator;



  
  private async safeCheck(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    const tag = (await locator.evaluate(el => el.tagName.toLowerCase())).toString();
    const type = (await locator.getAttribute('type')) ?? '';
    if (!(tag === 'input' && (type === 'checkbox' || type === 'radio'))) {
    throw new Error('safeCheck expects an <input type="checkbox|radio"> locator.');
      }
      if (!(await locator.isChecked().catch(() => false))) {
        await locator.check();
        }
    }

  private async selectBankCharge(charge: BankChargeType) {
  switch (charge) {
    case 'OUR':
      await this.safeCheck(this.bankChargesOurRadioButton);
      break;
    case 'SHARED':
      await this.safeCheck(this.bankChargesSharedRadioButton);
      break;
    case 'THEY':
      await this.safeCheck(this.bankChargesTheyRadioButton);
      break;
    default:
      throw new Error(`Unsupported bank charge: ${charge}`);
  }
}
  
  async waitForUXLoading(extraSpinnerSelectors: string[] = []) {
    const spinnerSelectors = [
      '.ux-loading',
      '.loading',
      '.spinner',
      '.mat-progress-spinner',
      '.cdk-overlay-backdrop',
      ...extraSpinnerSelectors,
    ];
    await Promise.all(
      spinnerSelectors.map(async (sel) => {
        const loc = this.page.locator(sel);
        try {
          if (await loc.first().isVisible({ timeout: 500 }).catch(() => false)) {
            await loc.first().waitFor({ state: 'hidden', timeout: 15_000 });
          }
        } catch { /* ignore */ }
      }),
    );
    await this.page.waitForLoadState('networkidle');
  }

  async safeClick(locator: Locator, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click();
  }

  async safeFill(locator: Locator, value: string, timeout = 15_000) {
    await expect(locator).toBeVisible({ timeout });
    await locator.fill(value);
  }

  async saferClick(locator: Locator, timeout = 20_000) {
    await expect(locator).toBeVisible({ timeout });
    await expect(locator).toBeEnabled({ timeout });
    await locator.click({ trial: true });
    await locator.click();
  }

  async handleAnnouncementIfPresent() {
    const acknowledgeBtn = this.authenticate;

    if (await acknowledgeBtn.isVisible({ timeout: 20_000 }).catch(() => false)) {
        await acknowledgeBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}

  async waitForCurrency(timeout = 1000) {
    return await this.MYRcurrency.isVisible({ timeout }).catch(() => false);
  }

  async waitForTTFormReady(timeout = 50_000) {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
    await expect(this.fromAccount).toBeEnabled({ timeout });
  }

  async handleCognitiveContinueIfPresent() {
    const paye2ScamacknowledgeBtn = this.cognitiveContinue;
    await this.page.waitForTimeout(5000); // wait for potential pop-up to appear
    if (await paye2ScamacknowledgeBtn.isVisible({ timeout: 20_000 }).catch(() => false)) {
        await this.saferClick(this.cognitiveContinue, 20_000);
        await this.page.waitForLoadState('networkidle');
    }
}

  async waitForNewPayeeFormReady(timeout = 20_000) {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.waitForUXLoading();
    await expect(this.enterNewPayeeBankID).toBeVisible({ timeout });
    await expect(this.enterNewPayeeBankID).toBeEnabled({ timeout });
  }

  async waitForNewTTPreviewPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.newTTsubmitButton).toBeVisible({ timeout });
    await expect(this.newTTsubmitButton).toBeEnabled({ timeout });
  }

  /** Wait until submitted page is ready (finish/done visible) */
  async waitFornewTTSubmittedPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.newTTfinishButton).toBeVisible({ timeout });
  }

  async handleMYRContinueIfPresent() {
    const MYRContinueBtn = this.MYRcontinue;
    await this.page.waitForTimeout(5000); // wait for potential pop-up to appear
    if (await MYRContinueBtn.isVisible({ timeout: 20_000 }).catch(() => false)) {
        await this.saferClick(this.MYRcontinue, 20_000);
        await this.page.waitForLoadState('networkidle');
    }
}


  async addNewTTPayee(input: NewTTPayeeInput): Promise<NewTTPayeeResult> {
    const { name, nickName, city, add1, add2, bankId, routingCode, accountNumber, intermediaryBankLocation, intermediaryBankId, bankChargeType, purposeCode, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity } = input;
      await this.safeClick(this.newPayeeTab)
      await this.handleCognitiveContinueIfPresent();
      await this.waitForNewPayeeFormReady();
      await this.enterNewPayeeBankID.click();
      await this.enterNewPayeeBankID.fill(bankId);
      await this.page.keyboard.press('Enter');
      await this.enterNewPayeeBankID.blur();
      await this.safeClick(this.findTTBankIDButton);
      await this.safeClick(this.bankIDRadioButton);

      await this.safeClick(this.inputRoutingNumber);
      await this.safeFill(this.inputRoutingNumber, routingCode);
      await this.page.keyboard.press('Tab');
      await this.inputRoutingNumber.blur();

      await this.safeClick(this.newTTPayeeAccountNumber);
      await this.safeFill(this.newTTPayeeAccountNumber, accountNumber);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeAccountNumber.blur();
    
      await this.safeClick(this.newTTPayeeName);
      await this.safeFill(this.newTTPayeeName, name);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeName.blur();

      await this.safeClick(this.newTTPayeeNickname);
      await this.safeFill(this.newTTPayeeNickname, nickName);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeNickname.blur();

      await this.safeClick(this.payeeLocation);
      await this.safeClick(this.MYRlocation);
      await this.payeeLocation.blur();

      await this.safeClick(this.newPayeeCity);
      await this.safeFill(this.newPayeeCity, city);
      await this.page.keyboard.press('Tab');
      await this.newPayeeCity.blur();

      await this.safeClick(this.newTTPayeeAddress1);
      await this.safeFill(this.newTTPayeeAddress1, add1);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeAddress1.blur();

      await this.safeClick(this.newTTPayeeAddress2);
      await this.safeFill(this.newTTPayeeAddress2, add2);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeAddress2.blur();

      await this.intermediaryBankCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.safeClick(this.intermediaryBankLocation);
      await this.safeClick(this.intermediaryMYRLocation);
      await this.intermediaryBankLocation.blur();
      

      await this.intermediaryBankId.click();
      await this.intermediaryBankId.fill(intermediaryBankId);
      await this.page.keyboard.press('Enter');
      await this.intermediaryBankId.blur();

      await this.safeClick(this.findIntermediaryBankIDButton);
      await this.safeClick(this.bankIDRadioButton);

      await this.selectBankCharge(bankChargeType);
      await this.newTTPurposeCode.click();
      
      await this.safeClick(this.inputNewTTPurposeCode);
      await this.safeFill(this.inputNewTTPurposeCode, purposeCode);
      await this.safeClick(this.newTTPurposeCodeSelect);
      await this.newTTPurposeCode.blur();

      await this.safeClick(this.newTTPaymentRemark);
      await this.safeFill(this.newTTPaymentRemark, payeeBankMsg);
      await this.newTTPaymentRemark.blur();

      await this.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.safeClick(this.newTTPayeeEmail1);
      await this.safeFill(this.newTTPayeeEmail1, email1);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail1.blur();

      await this.safeClick(this.newTTPayeeEmail2);
      await this.safeFill(this.newTTPayeeEmail2, email2);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail2.blur();

      await this.safeClick(this.newTTPayeeEmail3);
      await this.safeFill(this.newTTPayeeEmail3, email3);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail3.blur();

      await this.safeClick(this.newTTPayeeEmail4);
      await this.safeFill(this.newTTPayeeEmail4, email4);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail4.blur();

      await this.safeClick(this.newTTPayeeEmail5);
      await this.safeFill(this.newTTPayeeEmail5, email5);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail5.blur();

      await this.safeClick(this.newTTPayeeRemark);
      await this.safeFill(this.newTTPayeeRemark, payeeMsg);
      await this.newTTPayeeRemark.blur();

      await this.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.safeClick(this.additionalNoteRemark);
      await this.safeFill(this.additionalNoteRemark, additionalNote);
      await this.additionalNoteRemark.blur();

      await this.safeClick(this.orderingBankMsg);
      await this.safeFill(this.orderingBankMsg, remitterIdentity);
      await this.orderingBankMsg.blur();
      return { name, nickName, city, add1, add2, bankId, routingCode, accountNumber, intermediaryBankLocation, intermediaryBankId, purposeCode, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity };
 };

  async getNewTTReferenceText(): Promise<string> {
    const raw = await this.newTTreferenceID.textContent();
    return (raw ?? '').trim();
  }

  async getNewTTReferenceID(): Promise<string> {
    const raw = await this.getNewTTReferenceText();
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }

  async newTTWaitForViewPaymentPageReady(timeout = 25_000) {
    await this.waitForUXLoading();
    await expect(this.newTTFromAccountViewLabel).toBeVisible({ timeout });
    await expect(this.newTTPaymentRefLabel).toBeVisible({ timeout });
    await expect(this.newTTHashValueLabel).toBeVisible({ timeout });
  }


  async waitForSGDCurrency(timeout = 1000) {
    return await this.SGDcurrency.isVisible({ timeout }).catch(() => false);
  }

  async addExistingTTPayee(input: ExistingTTPayeeInput): Promise<ExistingTTPayeeResult> {
    const {existingAccountNumber, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity } = input;
      await this.safeClick(this.existingPayeeTab)

      await this.safeClick(this.existingPayeeBankAccount);
      await this.safeFill(this.existingPayeeBankAccount, existingAccountNumber);
      await this.existingPayeeBankAccount.blur();
      await this.safeClick(this.existingPayeeBankAccountSelect);

      await this.selectBankCharge(bankChargeType);

      await this.safeClick(this.newTTPaymentRemark);
      await this.safeFill(this.newTTPaymentRemark, payeeBankMsg);
      await this.page.keyboard.press('Tab');
      await this.newTTPaymentRemark.blur();

      await this.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.safeClick(this.newTTPayeeEmail1);
      await this.safeFill(this.newTTPayeeEmail1, email1);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail1.blur();

      await this.safeClick(this.newTTPayeeEmail2);
      await this.safeFill(this.newTTPayeeEmail2, email2);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail2.blur();

      await this.safeClick(this.newTTPayeeEmail3);
      await this.safeFill(this.newTTPayeeEmail3, email3);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail3.blur();

      await this.safeClick(this.newTTPayeeEmail4);
      await this.safeFill(this.newTTPayeeEmail4, email4);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail4.blur();

      await this.safeClick(this.newTTPayeeEmail5);
      await this.safeFill(this.newTTPayeeEmail5, email5);
      await this.page.keyboard.press('Tab');
      await this.newTTPayeeEmail5.blur();

      await this.safeClick(this.newTTPayeeRemark);
      await this.safeFill(this.newTTPayeeRemark, payeeMsg);
      await this.newTTPayeeRemark.blur();

      await this.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.safeClick(this.additionalNoteRemark);
      await this.safeFill(this.additionalNoteRemark, additionalNote);
      await this.additionalNoteRemark.blur();

      await this.safeClick(this.orderingBankMsg);
      await this.safeFill(this.orderingBankMsg, remitterIdentity);
      await this.orderingBankMsg.blur();
      return {existingAccountNumber, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity };
 };

 async ttSaveAsTemplate() {
      await this.ttSaveAsTemplateCheckbox.evaluate(el => (el as HTMLElement).click());
      await this.safeClick(this.ttSaveAsTemplateInput);
      const templateName = `Template_${Date.now()}`;
      await this.safeFill(this.ttSaveAsTemplateInput, templateName);
      await this.page.keyboard.press('Tab');
      await this.ttSaveAsTemplateInput.blur();
      return templateName;
    }
  
 async waitForTemplateFilterReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.templateFilter).toBeVisible({ timeout });
    await expect(this.templateFilter).toBeEnabled({ timeout });
  } 

 async searchAndOpenByTemplateReference(templateName: string) {
    await this.safeClick(this.templateMenu);
    await this.waitForTemplateFilterReady();
    await this.safeFill(this.templateFilter, templateName);
    await this.safeClick(this.templateLink);
  } 

 async waitForSaveAsDraft(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.ttSaveAsDraftSuccessMessage).toBeVisible({ timeout });
  }

  async getDraftReferenceText(): Promise<string> {
    const raw = await this.ttSaveAsDraftReferenceID.textContent();
    return (raw ?? '').trim();
  }

  async getDraftReferenceID(): Promise<string> {
    const raw = await this.getDraftReferenceText();
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }

  async waitForRejectPaymentSuccess(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.ttRejectPaymentSuccessMessage).toBeVisible({ timeout });
    await expect(this.ttRejectPaymentReasonInput).toBeEnabled({ timeout });
    await this.saferClick(this.ttRejectPaymentReasonInput);
    await this.safeFill(this.ttRejectPaymentReasonInput, `Rejected by automation at ${new Date().toISOString()}`);
    await this.page.keyboard.press('Tab');
    await this.ttRejectPaymentReasonInput.blur();
    await this.saferClick(this.ttRejectPaymentSuccessButton);

  }

  async waitForRejectTransactionID(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.ttSaveAsDraftSuccessMessage).toBeVisible({ timeout });
  }

  async getRejectReferenceText(): Promise<string> {
    const raw = await this.ttSaveAsDraftReferenceID.textContent();
    return (raw ?? '').trim();
  }

  async getRejectReferenceID(): Promise<string> {
    const raw = await this.getRejectReferenceText();
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }


  }
