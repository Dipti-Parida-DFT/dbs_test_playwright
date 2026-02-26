import { Page, Locator, expect } from '@playwright/test';
import { WebComponents } from '../../../lib/components';

export type NewPayeeInput = {
    name: string;
    bankId: string;
    accountNumber: string;
    DDAReferenceNo:string;
    MandateID: string,
  };
  
  
  export type NewPayeeResult = {
    accountNumber: string;
  };

export class BulkCollectionPage {

  private readonly page: Page;
  private readonly wc: WebComponents;
  
  constructor(page: Page, webComponents?: WebComponents) {
    this.page = page;
    this.wc = webComponents ?? new WebComponents();

    this.payTransferNav = page.locator('//span[contains(text()," Pay & Transfer ")]');
    this.bulkCollection = page.locator('//*[@id="icon__initiate_bulk_collection"]');
    this.fromAccount = page.locator('//p-auto-complete[@formcontrolname="fromAccount"]');
    this.creditType = page.locator('//p-auto-complete[@formcontrolname="debitType"]');
    this.creditTypeValueItemizedCredit = page.locator('//*[@id="options-type-bulk.labelItemizedCredit"]');

    //New Payear Tab
    this.newPayerTab = page.locator('//*[@id="ux-tab-labelNewPayer"]');
    this.newPayeeName = page.locator('//*[@name="new-payee-payeeName"]');
    this.payerBankID = page.locator('//*[@id="bulk-newPayee-bankId"]');
    this.findBankIDButton=page.locator('xpath=//*[@id="new-payee-bank-id-button"]');
    this.payeeBankSearchResults = page.locator('xpath=//table[@class="swift-results ng-star-inserted"]');
    this.payerBankResult = page.locator('//*[@class="search-result-container"]');
    this.newPayerAccountNumber = page.locator('//*[@name="new-payee-accountNumber"]');
    this.DDARef = page.locator('//*[@name="new-payee-dda"]');
    this.mandateID = page.locator('//*[@name="new-payee-mandate-id"]');
    this.addPayer = page.locator('//button[@name="add-payee"]');

    this.amount = page.locator('//*[@name="payeeAmount"]');
    this.transactionCode = page.locator('//*[@formcontrolname="transactionCode"]');
    this.transactionCode92Direct = page.locator('//div[@id="select-item-92 - Direct Debit(Merchant Payment)"]');
    this.purposeOfPayment = page.locator('//*[@formcontrolname="payeePurposeCode"]');
    this.purposeOfPaymentMerchantInitiatedBills = page.locator('//span[text()="Merchant Initiated Bills Payment"]');

    this.particular = page.locator('//*[@name="payeeParticulars"]');
    this.showOptionDetailPayee1 = page.locator('//div[@id="temp-bulk-create-optDetail_0"]');
    this.collectionDetails = page.locator('//textarea[@name="payeeDetails"]');
    this.msgToPayer = page.locator('//span[text()="5 notifications "]');
    this.emailId0 = page.locator('//*[@name="email-0"]');
    this.emailId1 = page.locator('//*[@name="email-1"]');
    this.emailId2 = page.locator('//*[@name="email-2"]');
    this.emailId3 = page.locator('//*[@name="email-3"]');
    this.emailId4 = page.locator('//*[@name="email-4"]');
    this.emailMessage = page.locator('//textarea[@name="adviceContent"]');
    this.earliestAvailableDateCheckbox = page.locator('xpath=//span[text()="Earliest Available Date "]');

    this.nextButton = page.locator('//button[@name="next"]');
    this.submitButton = page.locator('//button[@name="submit"]');
    this.finishButton = page.locator('//button[@name="finish"]');
    this.referenceID = page.locator('//label[contains(text(),"Bulk Collection")]');
    

    this.hashValue = page.locator('//*[@id="bulk-view-hashValue"]');
    this.toAccountNumberLabel = page.locator('//span[@id="bulk-view-accountNum"]');
    this.toAccountNameLabel = page.locator('//span[@id="bulk-view-accountName"]');
    this.paymentTypeValue = page.locator('//*[@id="bulk-view-paymentType"]');
    this.totalAmountValue = page.locator('//*[@id="bulk-view-paymentAmount"]');
    this.viewCreditValue = page.locator('//*[@id="bulk-view-debitType-template"]');
    this.paymentDate = page.locator('//*[@id="bulk-view-paymentDate"]');

    this.referenceValue = page.locator('//*[@id="viewReference"]');
    this.batchIDValue = page.locator('//*[@id="bulk-view-batchId"]');
    this.payerNameValue = page.locator('//*[@id="bulk-view-name_0"]');
    this.payerNickNameValue = page.locator('//*[@id="bulk-view-nickName_0"]');
    
    this.bankNameValue = page.locator('//*[@id="bulk-view-payeeBankName_0"]');
    this.bankCodeValue = page.locator('//*[@id="bulk-view-bankDetailsMsgDisplay_0"]');

    this.accountNumberValue = page.locator('//strong[@id="bulk-view-acctNum_0"]');
    this.DDAReferenceValue = page.locator('//*[@id="bulk-view-ddaRef_0"]');

    this.mandateIdValue = page.locator('//*[@id="bulk-view-mandateId_0"]');
    this.transactionStatusValue = page.locator('//strong[@id="bulk-view-pendingStatus_0"]');
    
    this.amountValue = page.locator('//button[@name="next"]');
    this.transactionCodeView = page.locator('//button[@name="submit"]');
    this.payeePurposeCodeValue = page.locator('//button[@name="next"]');
    this.particularsValue = page.locator('//button[@name="submit"]');

    this.showOptionView = page.locator('//button[@name="next"]');
    this.collectionDetailValue = page.locator('//button[@name="submit"]');
    this.messageValue = page.locator('//button[@name="next"]');
    this.emailList = page.locator('//button[@name="submit"]');
  }

  //Locators
  readonly payTransferNav: Locator;
  readonly bulkCollection: Locator;
  readonly fromAccount: Locator;
  readonly creditType: Locator;
  readonly creditTypeValueItemizedCredit: Locator;

  readonly newPayerTab: Locator;
  readonly newPayeeName: Locator;
  readonly payerBankID: Locator;
  readonly findBankIDButton: Locator;
  readonly payeeBankSearchResults: Locator;
  readonly payerBankResult: Locator;
  readonly newPayerAccountNumber: Locator;
  readonly DDARef: Locator;
  readonly mandateID: Locator;
  readonly addPayer: Locator;

  readonly amount: Locator;
  readonly transactionCode: Locator;
  readonly transactionCode92Direct: Locator;
  readonly purposeOfPayment: Locator;
  readonly purposeOfPaymentMerchantInitiatedBills: Locator;
  readonly particular: Locator;
  readonly showOptionDetailPayee1: Locator;
  readonly collectionDetails: Locator;
  readonly msgToPayer: Locator;
  readonly emailId0: Locator;
  readonly emailId1: Locator;
  readonly emailId2: Locator;
  readonly emailId3: Locator;
  readonly emailId4: Locator;
  readonly emailMessage: Locator;
  readonly earliestAvailableDateCheckbox: Locator;
  
  readonly nextButton: Locator;
  readonly submitButton: Locator;
  readonly finishButton: Locator;
  readonly referenceID: Locator;

  //Bulk Collection - validation locators
  readonly hashValue: Locator;
  readonly toAccountNumberLabel: Locator;
  readonly toAccountNameLabel: Locator;
  readonly paymentTypeValue: Locator;
  readonly totalAmountValue: Locator;
  readonly viewCreditValue: Locator;
  readonly paymentDate: Locator;

  readonly referenceValue: Locator;
  readonly batchIDValue: Locator;
  readonly payerNameValue: Locator;
  readonly payerNickNameValue: Locator;
  readonly bankNameValue: Locator;
  readonly bankCodeValue: Locator;
  readonly accountNumberValue: Locator;
  readonly DDAReferenceValue: Locator;

  readonly mandateIdValue: Locator;
  readonly transactionStatusValue: Locator;
  readonly amountValue: Locator;
  readonly transactionCodeView: Locator;
  readonly payeePurposeCodeValue: Locator;
  readonly particularsValue: Locator;

  readonly showOptionView: Locator;
  readonly collectionDetailValue: Locator;
  readonly messageValue: Locator;
  readonly emailList: Locator;

// create lib => components.ts object
webComponents = new WebComponents();
  

    /**
     * Author : LC5741501
     * Created Date: 17/02/2026
     * This Method "addNewPayeeWithDetails" : Add's a new payee with all details (reusable in all tests).
     */
  async addNewPayerWithAllDetails(input: NewPayeeInput): Promise<NewPayeeResult> {
    const { name, bankId, accountNumber, DDAReferenceNo, MandateID } = input;
  
      // Click : New Payee Tab
      await this.newPayerTab.click();
  
      // Enter : Payee Name
      await this.webComponents.enterTextarea(this.newPayeeName, name);
      await this.page.keyboard.press('Tab');
      await this.newPayeeName.blur();
  
      // Enter : Payee bank ID
      await this.webComponents.enterTextarea(this.payerBankID, bankId);
      await this.page.keyboard.press('Enter');
      await this.payerBankID.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.findBankIDButton);
      await expect(this.payeeBankSearchResults.first()).toBeVisible({ timeout: 15000 });
      await this.payeeBankSearchResults.first().click();

      // Click : Payee bank account number
      await this.webComponents.waitElementToBeVisible(this.newPayerAccountNumber);
      await this.webComponents.enterTextarea(this.newPayerAccountNumber, accountNumber);
  
      // Enter : DDA reference number
      await this.webComponents.enterTextarea(this.DDARef, DDAReferenceNo);

      // Enter : DDA reference number
      await this.webComponents.enterTextarea(this.mandateID, MandateID);
      
      //Click : Add Payee button
      await this.webComponents.clickWhenVisibleAndEnabled(this.addPayer);
      return {accountNumber};
    }


    /**
   * Author : LC5741501
   * Created Date: 20/02/2026
   * @param testData : is a Json object
   * This method Enters Step 2: Amount and other opetional fields 
   */
  async enterNewPayerAmountAndOptionalDetails(testData){

    // Step 2: Enter Amount (SGD) = add Amount
    await this.webComponents.enterTextarea(this.amount, testData.BulkPayment.amount);

    // Step 2: Select: Transaction code
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode);
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode92Direct);
    
    // Step 2: Select: Purpose of Payment
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPayment);
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPaymentMerchantInitiatedBills);

    // Enter: Particulars(Optional)
    await this.webComponents.enterTextarea(this.particular, testData.BulkPayment.particulars);

    // Click Show optional details arrow
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetailPayee1);
    
    // Enter: Collection details to the payer bank(Optional)
    await this.webComponents.enterTextarea(this.collectionDetails, testData.BulkPayment.collectionDetails);

    // Click : "Message to the payer" checkbox
    await this.webComponents.clickWhenVisibleAndEnabled(this.msgToPayer);
    
    // Enter : Emails 1
    await this.webComponents.enterTextarea(this.emailId0, testData.BulkPayment.emailId0);
    // Enter : Emails 2
    await this.webComponents.enterTextarea(this.emailId1, testData.BulkPayment.emailId1);
    // Enter : Emails 3
    await this.webComponents.enterTextarea(this.emailId2, testData.BulkPayment.emailId2);
    // Enter : Emails 4
    await this.webComponents.enterTextarea(this.emailId3, testData.BulkPayment.emailId3);
    // Enter : Emails 5
    await this.webComponents.enterTextarea(this.emailId4, testData.BulkPayment.emailId4);

    // Enter : Emails Mesage (Textarea)
    await this.webComponents.enterTextarea(this.emailMessage, testData.BulkPayment.emailMessage);

  }

  /**
    *  Author: LC5741501
    * Created Date: 26/02/26
    * Returns the raw banner text (trimmed). If you only need EBLV…,
    */
   async getReferenceText(): Promise<string> {
    const raw = await this.referenceID.textContent();
    return (raw ?? '').trim();
   }
   
   
  /**
    * Author: LC5741501
    * Created Date: 26/02/26
    * It Extracts the reference ID and returns it
    */
  async getReferenceID(): Promise<string> {
    const raw = await this.getReferenceText();
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }



  /** 
    * Author: LC5741501
    * Created Date: 26/02/26
    * Wait until the Bulk Collection form Load 
    * (e.g., wait for the locator "fromAccount" toBeVisibale) are ready */
   async waitForBulkCollectionFormReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
    await expect(this.fromAccount).toBeEnabled({ timeout });
  }

  /** 
   * Author: LC5741501
   * Created Date: 26/02/26
   * Wait until preview page is ready (submit button visible/enabled) */
  async waitForPreviewPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.submitButton).toBeVisible({ timeout });
    await expect(this.submitButton).toBeEnabled({ timeout });
  }
  

  /** 
   * Author: LC5741501
   * Created Date: 26/02/26
   * Wait until submitted page is ready (finish button visible) */
  async waitForSubmittedPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.finishButton).toBeVisible({ timeout });
  }

  /** 
   * Author: LC5741501
   * Created Date: 26/02/26
   * Wait until PayAndTransfer page is ready (Bulk Collection button visible) */
  async waitForPayAndTransferPageReady(timeout = 20_000) {
    await this.waitForUXLoading();
    await expect(this.bulkCollection).toBeVisible({ timeout });
  }

  /** Wait until view payment page has loaded key labels */
  async waitForViewPaymentPageReady(timeout = 55_000) {
    await this.waitForUXLoading();
    await expect(this.fromAccountViewLabel).toBeVisible({ timeout });
    await expect(this.amountViewLabel).toBeVisible({ timeout });
    await expect(this.hashValueLabel).toBeVisible({ timeout });
  }

  
  /**
   * Author: LC5741501
   * Created Date: 26/02/26
   * Approximation of the old global waitForUXLoading():
   * waits for common spinners/overlays to hide, then network idle.
   * Add app-specific spinners to the list as needed.
   */
  async waitForUXLoading(extraSpinnerSelectors: string[] = []) {
    const spinnerSelectors = [
      '.ux-loading',
      '.loading',
      '.spinner',
      '.mat-progress-spinner',
      '.cdk-overlay-backdrop',
      ...extraSpinnerSelectors,
    ];
    for (const sel of spinnerSelectors) {
      const spinner = this.page.locator(sel).first();
      try {
        if (await spinner.isVisible({ timeout: 500 }).catch(() => false)) {
          await spinner.waitFor({ state: 'hidden', timeout: 15_000 });
        }
      } catch {
        /* ignore */
      }
    }
    await this.page.waitForLoadState('networkidle');
  }


}