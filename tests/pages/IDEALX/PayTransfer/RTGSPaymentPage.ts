// pages/IDEALX/PayTransfer/RTGSPaymentPage.ts
/**
 * RTGS Payment Page Object
 * Handles Real-Time Gross Settlement (RTGS) payment workflows in IDEALX
 */

import { Page, Locator } from '@playwright/test';

export class RTGSPaymentPage {
  constructor(private readonly page: Page) {}

  // ═══════════════════════════════════════════════════════════════════
  // CREATION PAGE - Core Fields
  // ═══════════════════════════════════════════════════════════════════

  // Account & Amount
  get fromAccount(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="fromAccount"]');
  }

  get amount(): Locator {
    // ShuRu elements replaced with native input in current UI version
    return this.page.locator('xpath=//input[@name="send-amount"]');
  }

  // Payee Tabs
  get existingPayeeTab(): Locator {
    return this.page.locator('xpath=//a[@id="ux-tab-EXISTING"]/span');
  }

  get newPayeeTab(): Locator {
    return this.page.locator('xpath=//a[@id="ux-tab-NEW"]/span');
  }

  get existingPayee(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="payee"]');
  }

  // New Payee Fields
  get newPayeeName(): Locator {
    return this.page.locator('xpath=//textarea[@name="new-payee-name"]');
  }

  get newPayeeAdd1(): Locator {
    return this.page.locator('xpath=//input[@name="new-payee-add1"]');
  }

  get newPayeeAdd2(): Locator {
    return this.page.locator('xpath=//input[@name="new-payee-add2"]');
  }

  get newPayeeAdd3(): Locator {
    return this.page.locator('xpath=//input[@name="new-payee-add3"]');
  }

  get payeeBankID(): Locator {
    return this.page.locator('xpath=//input[contains(@placeholder,"bank ID")]');
  }

  get newPayeeAcctNumber(): Locator {
    return this.page.locator('xpath=//input[@name="new-payee-acct-number"]');
  }

  get newPayeeNickName(): Locator {
    return this.page.locator('xpath=//input[@name="new-payee-nick-name"]');
  }

    get newPayeeLocation(): Locator {
    return this.page.locator('xpath=//input[@id="payee-location"]');
  }

    get townCity(): Locator {
    return this.page.locator('xpath=//input[@name="townCity"]');
  }

   // RTGS-Specific Fields (Domestic Transfer Details)
  get RTGSPaymentCheckBox(): Locator {
    return this.page.locator('xpath=//*[@id="immediate_type"]');
  }

  get rtgsPaymentType(): Locator {
    return this.page.locator('xpath=//p[contains(.,"Premium [RTGS]")]');
  }

  get residStatus(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="residStatus"]');
  }

  get category(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="category"]');
  }

  get relationship(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="relationship"]');
  }

  get identity(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="identity"]');
  }

  get purposeCode(): Locator {
    return this.page.locator('xpath=//multi-level-dropdown[@formcontrolname="purposeCode"]');
  }

  get purposeCodeOption(): Locator {
    return this.page.locator('xpath=//span[contains(text(),"2710 - Income from loan account")]');
  }

  get regulatoryComplianceCode(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="regulatoryComplianceCode"]');
  }

  get underlyingCode(): Locator {
    return this.page.locator('xpath=//p-auto-complete[@formcontrolname="underlyingCode"]');
  }

  get bankChargesThey(): Locator {
    return this.page.locator('xpath=//input[@name="bank-charge-P"]');
  }

  get paymentDetail(): Locator {
    return this.page.locator('xpath=//textarea[@name="paymentDetail"]');
  }

  // Beneficiary Advising (Optional)
  get isBeneAdvising(): Locator {
    return this.page.locator('xpath=//label[@for="isBeneAdvising"]');
  }

  get emailId0(): Locator {
    return this.page.locator('xpath=//input[@name="email-id-0"]');
  }

  get emailId1(): Locator {
    return this.page.locator('xpath=//input[@name="email-id-1"]');
  }

  get emailId2(): Locator {
    return this.page.locator('xpath=//input[@name="email-id-2"]');
  }

  get emailId3(): Locator {
    return this.page.locator('xpath=//input[@name="email-id-3"]');
  }

  get emailId4(): Locator {
    return this.page.locator('xpath=//input[@name="email-id-4"]');
  }

  get message(): Locator {
    return this.page.locator('xpath=//*[@name="adviceContent"]');
  }

  // Transaction Note
  get isTransactionNote(): Locator {
    return this.page.locator('xpath=//label[@for="isTransactionNote"]');
  }

  get transactionNote(): Locator {
    return this.page.locator('xpath=//textarea[@name="transactionNote"]');
  }

  // Continue & Navigation Buttons
  get continueBtn(): Locator {
    return this.page.locator('xpath=//*[@id="cognitive-continue"]');
  }

  get saveAsDraft(): Locator {
    return this.page.locator('xpath=//button[@name="save-as-draft"]');
  }

  get nextButton(): Locator {
    return this.page.locator('xpath=//button[@name="next"]');
  }

  // Approval & Submission
  get approvalNowCheckBox(): Locator {
    return this.page.locator('xpath=//input[@name="approveNow"]');
  }

  get getChallengeSMS(): Locator {
    return this.page.locator('xpath=//button[@name="get-challenge"]');
  }

  get challengeResponse(): Locator {
    return this.page.locator('xpath=//input[@name="responseCode"]');
  }

  get savaAsTemplateCheckBox(): Locator {
    return this.page.locator('xpath=//input[@name="saveAsTemplate"]');
  }

  get templateName(): Locator {
    return this.page.locator('xpath=//input[@name="templateName"]');
  }

  get submitButton(): Locator {
    return this.page.locator('xpath=//button[@name="submit"]');
  }

  get finishedButton(): Locator {
    return this.page.locator('xpath=//button[@name="finish"]');
  }

  get dismissButton(): Locator {
    return this.page.locator('xpath=//button[@name="dismiss"]');
  }

  get rejectButton(): Locator {
    return this.page.locator('xpath=//button[@name="reject"]');
  }

  get reasonForRejection(): Locator {
    return this.page.locator('xpath=//textarea[@name="reasonForRejection"]');
  }

  get rejectDialogButton(): Locator {
    return this.page.locator('xpath=//dbs-reject-dialog/div/div[2]/div[2]/button[2]');
  }

  // ═══════════════════════════════════════════════════════════════════
  // VIEW/PREVIEW PAGE - Display Fields
  // ═══════════════════════════════════════════════════════════════════

  get headerRefValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-customerReference"]');
  }

  get statusValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-status"]');
  }

  get hashValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-hashValue"]');
  }

  get deductAmtValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-deductAmount"]');
  }

  get fromAccountValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-accountNum"]');
  }

  get acctBalanceValue(): Locator {
    return this.page.locator('xpath=//*[@id="view-domestic-acctBalance"]');
  }

  get toNewPayeeAcctNumValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-newPayee-acctNum"]');
  }

  get toNewPayeeNameValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-newPayee-name"]');
  }

  get toNewPayeeAdd1Value(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-add1"]');
  }

  get toNewPayeeAdd2Value(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-add2"]');
  }

  get toNewPayeeAdd3Value(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-add3"]');
  }

  get toExistingPayeeNameValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-existingPayee-name"]');
  }

  get paymentDateValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-paymentDate"]');
  }

  get paymentTypeValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-paymentType"]');
  }

  get amountValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-sendAmount"]');
  }

  get payeeBankNameValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-bankName"]');
  }

  get payeeBankAdd1Value(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-bankAdd1"]');
  }

  get payeeBankAdd2Value(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-bankAdd2"]');
  }

  get payeeBankAdd3Value(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-bankAdd3"]');
  }

  get payeeBankCityValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-bankCity"]');
  }

  get payeeBankCountryValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-bankCountry"]');
  }

  get payeeSwiftBicValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-newPayee-swiftBic"]');
  }

  get payeeBankCodeValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-bankCode"]');
  }

  get payeeBrchCodeValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-payee-brchCode"]');
  }

  get paymentDetailsValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-paymentDetail"]');
  }

  get msgValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-adviceContent"]');
  }

  get emailListValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-email"]');
  }

  get totalDeductAmtValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-deductAmount"]');
  }

  get messageToApproverValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-transactionNote"]');
  }

  get bankChargeValue(): Locator {
    return this.page.locator('xpath=//*[@id="domestic-view-bankCharge"]');
  }

  // ═══════════════════════════════════════════════════════════════════
  // ERROR MESSAGES
  // ═══════════════════════════════════════════════════════════════════

  get uxIxErrorMsg(): Locator {
    return this.page.locator('xpath=//div[@class="alert__container--error ng-star-inserted"]');
  }

  get uxErrorMsg(): Locator {
    return this.page.locator('xpath=//top-panel/div/div[starts-with(@class, "alert alert-error")]/ul');
  }

  get uxIxErrorMsgLegacy(): Locator {
    return this.page.locator('xpath=//dbs-top-panel/div/div[starts-with(@class, "alert alert-error")]');
  }
}
