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
    this.creditTypeValueConsolidatedCredit = page.locator('//*[@id="options-type-bulk.labelConsolidatedCredit"]');
    this.filterExistingPayee = page.locator('//*[@name="payee-selector"]');
    this.addButton = page.locator('//*[@name="add"]');

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
    this.amount1stPosition = page.locator('(//*[@name="payeeAmount"])[1]');
    this.transactionCode = page.locator('//*[@formcontrolname="transactionCode"]');
    this.transactionCode1stPosition = page.locator('(//*[@formcontrolname="transactionCode"])[1]');
    
    this.transactionCode92Direct = page.locator('//div[@id="select-item-92 - Direct Debit(Merchant Payment)"]');
    this.transactionCode98DirectDebit = page.locator('//div[@id="select-item-98 - Direct Debit(Merchant Payment - Consolidated posting)"]');
    this.transactionCode38DirecDebit = page.locator('//div[@id="select-item-38 - Direct Debit(Consolidated posting)"]');
    this.purposeOfPayment = page.locator('//*[@formcontrolname="payeePurposeCode"]');
    this.purposeOfPaymentMerchantInitiatedBills = page.locator('//span[text()="Merchant Initiated Bills Payment"]');

    this.particular = page.locator('//*[@name="payeeParticulars"]');
    this.particular1stPosition = page.locator('(//*[@name="payeeParticulars"])[1]');
    this.showOptionDetailPayee1 = page.locator('//div[@id="temp-bulk-create-optDetail_0"]');
    this.collectionDetailsPayer1 = page.locator('(//textarea[@name="payeeDetails"])[1]');
    this.collectionDetails = page.locator('//textarea[@name="payeeDetails"]');
    this.msgToPayer = page.locator('//span[text()="5 notifications "]');
    this.msgToPayer1 = page.locator('(//span[text()="5 notifications "])[1]');
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
    this.viewPayrollFilter = page.locator('xpath=//*[@id="bulk-view-filter"]');

    this.collectionSummaryLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[1]');
    this.totalPayeesLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[2]');
    this.totalPayeesValue = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[3]');
    this.totalAmountLabel = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[4]');
    this.totalAmountUSDValue = page.locator('xpath=(//*[@class="summary-panel step2-panel-triangle"]/div/span)[5]');


    this.payerNameValue = page.locator('//*[@id="bulk-view-name_0"]');
    this.payer2NameValue = page.locator('//*[@id="bulk-view-name_1"]');

    this.payerNickNameValue = page.locator('//*[@id="bulk-view-nickName_0"]');
    this.payer2NickNameValue = page.locator('//*[@id="bulk-view-nickName_1"]');
    
    this.bankNameValue = page.locator('//*[@id="bulk-view-payeeBankName_0"]');
    this.bankNamePayer2Value = page.locator('//*[@id="bulk-view-payeeBankName_1"]');

    this.bankCodeValue = page.locator('//*[@id="bulk-view-bankDetailsMsgDisplay_0"]');
    this.bankCodePayer2Value = page.locator('//*[@id="bulk-view-bankDetailsMsgDisplay_1"]');

    this.accountNumberValue = page.locator('//strong[@id="bulk-view-acctNum_0"]');
    this.accountNumberPayer2Value = page.locator('//strong[@id="bulk-view-acctNum_1"]');

    this.DDAReferenceValue = page.locator('//*[@id="bulk-view-ddaRef_0"]');
    this.DDAReferencePayer2Value = page.locator('//*[@id="bulk-view-ddaRef_1"]');

    this.mandateIdValue = page.locator('//*[@id="bulk-view-mandateId_0"]');
    this.mandateIdPayer2Value = page.locator('//*[@id="bulk-view-mandateId_1"]');

    this.status = page.locator('xpath=//*[@id="bulk-view-pendingStatus_0"]');
    this.statusPayer2 = page.locator('xpath=//*[@id="bulk-view-pendingStatus_1"]');

    this.transactionStatusValue = page.locator('//strong[@id="bulk-view-pendingStatus_0"]');
    
    this.amountValue = page.locator('//strong[@id="bulk-view-amount_0"]');
    this.amountPayer2Value = page.locator('//strong[@id="bulk-view-amount_1"]');

    this.transactionCodeView = page.locator('//dbs-view-transfer-list[1]//*[@id="transaction-code-label"]');
    this.transactionCodePayer2View = page.locator('//dbs-view-transfer-list[2]//*[@id="transaction-code-label"]');

    this.purposeOfPaymentValue = page.locator('//dbs-view-transfer-list[1]//*[@id="payee-purpose-code-label"]');

    this.particularsValue = page.locator('//*[@id="bulk-view-particular_0"]');
    this.particularsPayer2Value = page.locator('//*[@id="bulk-view-particular_1"]');

    this.showOptionDetails = page.locator('(//span[text()="Show optional details"])[2]');
    this.collectionDetailValue = page.locator('//*[@id="bulk-view-paymentDetails_0"]');
    this.emailList = page.locator('//button[@name="submit"]');

    this.emailmessageValue = page.locator('//*[@id="bulk-view-message_0"]');
    this.emailId0Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[1]');
    this.emailId1Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[2]');
    this.emailId2Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[3]');
    this.emailId3Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[4]');
    this.emailId4Value = page.locator('(//*[@id="bulk-view-email_0"]//span)[5]');

    this.activityLogSection = page.locator('xpath=//*[@class="payment-history"]');
    this.approvalDetails= page.locator('xpath=//*[@class="approval-details"]');

    this.deleteButonPayroll = page.locator('xpath=//button[@name="delete"]');
    this.deleteButonConfirmDeletePopup = page.locator('xpath=//button[@id="dialogDelete"]');
    this.transactionDeletedPopupLabel = page.locator('xpath=//h2[text()="Transaction deleted"]');
    this.transactionDeletedPopupLabelMsg = page.locator('xpath=//p[@id="dialogMessage"]/span');
    
  }

  //Locators
  readonly payTransferNav: Locator;
  readonly bulkCollection: Locator;
  readonly fromAccount: Locator;
  readonly creditType: Locator;
  readonly creditTypeValueItemizedCredit: Locator;
  readonly creditTypeValueConsolidatedCredit: Locator;
  readonly filterExistingPayee: Locator;
  readonly addButton: Locator;  

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
  readonly amount1stPosition: Locator;
  readonly transactionCode: Locator;
  readonly transactionCode1stPosition: Locator;
  readonly transactionCode92Direct: Locator;
  readonly transactionCode98DirectDebit: Locator;
  readonly transactionCode38DirecDebit: Locator;
  readonly purposeOfPayment: Locator;
  readonly purposeOfPaymentMerchantInitiatedBills: Locator;
  readonly particular: Locator;
  readonly particular1stPosition: Locator;
  readonly showOptionDetailPayee1: Locator;
  readonly collectionDetails: Locator;
  readonly collectionDetailsPayer1: Locator;
  readonly msgToPayer: Locator;
  readonly msgToPayer1: Locator;
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
  readonly viewPayrollFilter: Locator;

  readonly collectionSummaryLabel: Locator;
  readonly totalPayeesLabel: Locator;
  readonly totalPayeesValue: Locator;
  readonly totalAmountLabel: Locator;
  readonly totalAmountUSDValue: Locator;

  readonly payerNameValue: Locator;
  readonly payer2NameValue: Locator;

  readonly payerNickNameValue: Locator;
  readonly payer2NickNameValue: Locator;

  readonly bankNameValue: Locator;
  readonly bankNamePayer2Value: Locator;

  readonly bankCodeValue: Locator;
  readonly bankCodePayer2Value: Locator;

  readonly accountNumberValue: Locator;
  readonly accountNumberPayer2Value: Locator;

  readonly DDAReferenceValue: Locator;
  readonly DDAReferencePayer2Value: Locator;

  readonly status: Locator;
  readonly statusPayer2: Locator;

  readonly mandateIdValue: Locator;
  readonly mandateIdPayer2Value: Locator;

  readonly transactionStatusValue: Locator;
  
  readonly amountValue: Locator;
  readonly amountPayer2Value: Locator;

  readonly transactionCodeView: Locator;
  readonly transactionCodePayer2View: Locator;

  readonly purposeOfPaymentValue: Locator;
  
  readonly particularsValue: Locator;
  readonly particularsPayer2Value: Locator;

  readonly showOptionDetails: Locator;
  readonly collectionDetailValue: Locator;
  readonly emailList: Locator;

  readonly emailmessageValue: Locator;
  readonly emailId0Value: Locator;
  readonly emailId1Value: Locator;
  readonly emailId2Value: Locator;
  readonly emailId3Value: Locator;
  readonly emailId4Value: Locator;
  readonly activityLogSection: Locator;
  readonly approvalDetails: Locator;

  readonly deleteButonPayroll: Locator;
  readonly deleteButonConfirmDeletePopup: Locator;
  readonly transactionDeletedPopupLabel: Locator;
  readonly transactionDeletedPopupLabelMsg: Locator;

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
    await this.webComponents.enterTextarea(this.amount, testData.payer1.amount);

    // Step 2: Select: Transaction code
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode);
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode92Direct);
    
    // Step 2: Select: Purpose of Payment
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPayment);
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPaymentMerchantInitiatedBills);

    // Enter: Particulars(Optional)
    await this.webComponents.enterTextarea(this.particular, testData.payer1.particulars);

    // Click Show optional details arrow
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetailPayee1);
    
    // Enter: Collection details to the payer bank(Optional)
    await this.webComponents.enterTextarea(this.collectionDetails, testData.payer1.collectionDetails);

    // Click : "Message to the payer" checkbox
    await this.webComponents.clickWhenVisibleAndEnabled(this.msgToPayer);
    
    // Enter : Emails 1
    await this.webComponents.enterTextarea(this.emailId0, testData.payer1.emailId0);
    // Enter : Emails 2
    await this.webComponents.enterTextarea(this.emailId1, testData.payer1.emailId1);
    // Enter : Emails 3
    await this.webComponents.enterTextarea(this.emailId2, testData.payer1.emailId2);
    // Enter : Emails 4
    await this.webComponents.enterTextarea(this.emailId3, testData.payer1.emailId3);
    // Enter : Emails 5
    await this.webComponents.enterTextarea(this.emailId4, testData.payer1.emailId4);

    // Enter : Emails Mesage (Textarea)
    await this.webComponents.enterTextarea(this.emailMessage, testData.payer1.emailMessage);

  }

   /**
   * Author : LC5741501
   * Created Date: 20/02/2026
   * @param testData : is a Json object
   * This method Enters Step 2: Amount and other opetional fields 
   */
   async enterNewPayerAmountOptionalDetailsWhenExistingPayerAdded(testData){

    // Step 2: Enter Amount (SGD) = add Amount
    await this.webComponents.enterTextarea(this.amount1stPosition, testData.payer1.amount);

    // Step 2: Select: Transaction code
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode1stPosition);
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode98DirectDebit);
    
    // Step 2: Select: Purpose of Payment
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPayment);
    await this.webComponents.clickWhenVisibleAndEnabled(this.purposeOfPaymentMerchantInitiatedBills);

    // Enter: Particulars(Optional)
    await this.webComponents.enterTextarea(this.particular1stPosition, testData.payer1.particulars);

    // Click Show optional details arrow
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetailPayee1);
    
    // Enter: Collection details to the payer bank(Optional)
    await this.webComponents.enterTextarea(this.collectionDetailsPayer1, testData.payer1.collectionDetails);

    // Click : "Message to the payer" checkbox
    await this.webComponents.clickWhenVisibleAndEnabled(this.msgToPayer1);
    
    // Enter : Emails 1
    await this.webComponents.enterTextarea(this.emailId0, testData.payer1.emailId0);
    // Enter : Emails 2
    await this.webComponents.enterTextarea(this.emailId1, testData.payer1.emailId1);
    // Enter : Emails 3
    await this.webComponents.enterTextarea(this.emailId2, testData.payer1.emailId2);
    // Enter : Emails 4
    await this.webComponents.enterTextarea(this.emailId3, testData.payer1.emailId3);
    // Enter : Emails 5
    await this.webComponents.enterTextarea(this.emailId4, testData.payer1.emailId4);

    // Enter : Emails Mesage (Textarea)
    await this.webComponents.enterTextarea(this.emailMessage, testData.payer1.emailMessage);

  }

  /**
   * Author : LC5741501
   * Created Date: 20/02/2026
   * @param testData : is a Json object
   * This method Enters Step 2: Amount and other opetional fields 
   */
  async enterExtistingPayerAmountTransactionCodeAndParticulars(testData){

    // Step 2: Enter Amount (SGD) = add Amount
    await this.webComponents.enterTextarea(this.amount, testData.payer2.amount);

    // Step 2: Select: Transaction code
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode);
    await this.webComponents.clickWhenVisibleAndEnabled(this.transactionCode38DirecDebit);
    
    // Enter: Particulars(Optional)
    await this.webComponents.enterTextarea(this.particular, testData.payer2.particulars);

  }


   /**
     * Author : LC5741501
     * This method validates the details of Expected
     * values(JSON) Vs Actual Selected Payers Or Reference No (from UI) 
     */
   async validatePayerOrRefrenceNoDetailsOfBulkCollection(testData, reference) {

    // Assertions
    // 1) Hash value : Auto generated hence checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.hashValue);
    
    // 2) To : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.toAccountNumberLabel, testData.BulkCollectionValidationData.toAccountNumberLabel);
    await this.webComponents.compareUIVsJsonValue(this.toAccountNameLabel, testData.BulkCollectionValidationData.toAccountNameLabel);
    
    // 3) Payment Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.paymentTypeValue, testData.BulkCollectionValidationData.paymentType);

    // 4) Total amount : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountValue, testData.BulkCollectionValidationData.totalAmount);

    // 5) Credit Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.viewCreditValue, testData.BulkCollectionValidationData.creditType);
     
    //6) Payment Date: checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.paymentDate);

    // 7) Internal reference : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.referenceValue, reference);
    
    // 8) Batch ID : Auto Generated Validate it should not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.batchIDValue);

    // 9) Filter is Visible 
    await this.webComponents.waitElementToBeVisible(this.viewPayrollFilter);
    
    // Below validation from 10 to 14 is a additional validation
    // 10) Collection summary : Validate UI Vs Json (Payment summary Label)
    await this.webComponents.compareUIVsJsonValue(this.collectionSummaryLabel, testData.BulkCollectionValidationData.collectionSummaryLabel);

    // 11) Total Payees Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesLabel, testData.BulkCollectionValidationData.totalPayersLabel);
    
    // 12) Total Payees Value : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesValue, testData.BulkCollectionValidationData.totalPayersLabelValue);
    
    // 13) Total Amount Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountLabel, testData.BulkCollectionValidationData.totalAmountLabel);

    // 14) Total Amount Value : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountUSDValue, testData.BulkCollectionValidationData.totalAmountLabelValue);


    // 15) Payee/Nickname : Validate (Payee Name) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNameValue, testData.payer1.newPayeeName);

    // 16) Payee/Nickname : Validate (Nickname) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNickNameValue, testData.payer1.newPayeeName);

    // 17) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankNameValue, testData.BulkCollectionValidationData.bankNameValue);

    // 18) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankCodeValue, testData.BulkCollectionValidationData.bankCode);

    // 19) Account number: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.accountNumberValue, testData.payer1.newPayeeAcctNumber);

    // 20) Account number DDA reference: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.DDAReferenceValue, testData.payer1.DDAReference);
    
    // 21) Status (PendingApproval) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.status, testData.status.PendingApproval);
    
    // 22) Amount (SGD): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.amountValue, testData.payer1.amount);
    
    // 23) Transaction Code (92 - Direct Debit(Merchant Payment)) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.transactionCodeView, testData.payer1.transactionCode);

    // 24) Purpose of Payment (Merchant Initiated Bills Payment): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.purposeOfPaymentValue, testData.payer1.purposeOfPayment);

    // 25) Particulars: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.particularsValue, testData.payer1.particulars);

    // Click : showOptionalViewButton1
    await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetails);

    // 26) CollectionDetailValue: Validate UI Vs Json (Additional Validation)
    await this.webComponents.compareUIVsJsonValue(this.collectionDetailValue, testData.payer1.collectionDetails);
  
    // 27) Message to payee (optional): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.emailmessageValue, testData.payer1.emailMessage);
  
    // 27)Emails 1 to 5 : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.emailId0Value, testData.payer1.emailId0);
    await this.webComponents.compareUIVsJsonValue(this.emailId1Value, testData.payer1.emailId1);
    await this.webComponents.compareUIVsJsonValue(this.emailId2Value, testData.payer1.emailId2);
    await this.webComponents.compareUIVsJsonValue(this.emailId3Value, testData.payer1.emailId3);
    await this.webComponents.compareUIVsJsonValue(this.emailId4Value, testData.payer1.emailId4);

    // 28) Next approver : Visible
    await this.webComponents.waitElementToBeVisible(this.activityLogSection);
    // 29) Approval Details Section : Visible
    await this.webComponents.waitElementToBeVisible(this.approvalDetails);

  }


  /**
     * Author : LC5741501
     * This method validates the 2nd Payer details: Expected
     * values(JSON) Vs Actual Selected Payers Or Reference No (from UI) 
     */
  async validatePayer2ConsolidateValueInBulkCollection(testData, reference) {
      
          // Assertions
    // 1) Hash value : Auto generated hence checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.hashValue);
    
    // 2) To : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.toAccountNumberLabel, testData.BulkCollectionValidationData.toAccountNumberLabel);
    await this.webComponents.compareUIVsJsonValue(this.toAccountNameLabel, testData.BulkCollectionValidationData.toAccountNameLabel);
    
    // 3) Payment Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.paymentTypeValue, testData.BulkCollectionValidationData.paymentType);

    // 4) Total amount : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountValue, testData.BulkCollectionValidationData.totalAmountConsolidated);

    // 5) Credit Type : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.viewCreditValue, testData.BulkCollectionValidationData.creditTypeConsolidated);
     
    //6) Payment Date: checking value is Not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.paymentDate);

    // 7) Internal reference : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.referenceValue, reference);
    
    // 8) Batch ID : Auto Generated Validate it should not Null
    await this.webComponents.verifyUIElementTextIsNotNull(this.batchIDValue);

    // 9) Filter is Visible 
    await this.webComponents.waitElementToBeVisible(this.viewPayrollFilter);
    
    // Below validation from 10 to 14 is a additional validation
    // 10) Collection summary : Validate UI Vs Json (Payment summary Label)
    await this.webComponents.compareUIVsJsonValue(this.collectionSummaryLabel, testData.BulkCollectionValidationData.collectionSummaryLabel);

    // 11) Total Payees Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesLabel, testData.BulkCollectionValidationData.totalPayersLabel);
    
    // 12) Total Payees Value : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalPayeesValue, testData.BulkCollectionValidationData.totalPayersConsolidatedLabelValue);
    
    // 13) Total Amount Label : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountLabel, testData.BulkCollectionValidationData.totalAmountLabel);

    // 14) Total Amount Value : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.totalAmountUSDValue, testData.BulkCollectionValidationData.totalAmountConsolidatedLabelValue);

    // Payer1 Validation

    // 15) Payee/Nickname : Validate (Payee Name) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNameValue, testData.payer1.newPayeeName);

    // 16) Payee/Nickname : Validate (Nickname) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.payerNickNameValue, testData.payer1.newPayeeName);

    // 17) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankNameValue, testData.BulkCollectionValidationData.bankNameValue);

    // 18) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.bankCodeValue, testData.BulkCollectionValidationData.bankCode);

    // 19) Account number: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.accountNumberValue, testData.payer1.newPayeeAcctNumber);

    // 20) Account number DDA reference: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.DDAReferenceValue, testData.payer1.DDAReference);

    // 21) Mandate ID: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.mandateIdValue, testData.payer1.mandateID);
    
    // 22) Status (PendingApproval) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.status, testData.status.PendingApproval);
    
    // 23) Amount (SGD): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.amountValue, testData.payer1.amount);
    
    // 24) Transaction Code (92 - Direct Debit(Merchant Payment)) : Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.transactionCodeView, testData.payer1.transactionCodeTc002);

    // 25) Purpose of Payment (Merchant Initiated Bills Payment): Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.purposeOfPaymentValue, testData.payer1.purposeOfPayment);

    // 26) Particulars: Validate UI Vs Json
    await this.webComponents.compareUIVsJsonValue(this.particularsValue, testData.payer1.particulars);

    // Click : showOptionalViewButton1
   await this.webComponents.clickWhenVisibleAndEnabled(this.showOptionDetails);

   // 27) CollectionDetailValue: Validate UI Vs Json (Additional Validation)
   await this.webComponents.compareUIVsJsonValue(this.collectionDetailValue, testData.payer1.collectionDetails);
  
  // 28) Message to payee (optional): Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.emailmessageValue, testData.payer1.emailMessage);
  
  // 29)Emails 1 to 5 : Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.emailId0Value, testData.payer1.emailId0);
  await this.webComponents.compareUIVsJsonValue(this.emailId1Value, testData.payer1.emailId1);
  await this.webComponents.compareUIVsJsonValue(this.emailId2Value, testData.payer1.emailId2);
  await this.webComponents.compareUIVsJsonValue(this.emailId3Value, testData.payer1.emailId3);
  await this.webComponents.compareUIVsJsonValue(this.emailId4Value, testData.payer1.emailId4);

  // Note: Below all Validation are (Additional Validation) for Payer2
  
  // 30) Payee/Nickname : Validate (Payee Name) UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.payer2NameValue, testData.payer2.newPayeeName);

  // 31) Payee/Nickname : Validate (Nickname) UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.payer2NickNameValue, testData.payer2.newPayeeNickName);

  // 32) Bank/SWIFT BIC: Validate (Bank) UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.bankNamePayer2Value, testData.BulkCollectionValidationDataPayer2.bankNameValue);

  // 33) Bank/SWIFT BIC: Validate (SWIFT) UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.bankCodePayer2Value, testData.BulkCollectionValidationDataPayer2.bankCode);

  // 34) Account number: Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.accountNumberPayer2Value, testData.payer2.newPayeeAcctNumber);

  // 35) Account number DDA reference: Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.DDAReferencePayer2Value, testData.payer2.DDAReference);

  // 36) Mandate ID: Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.mandateIdPayer2Value, testData.payer2.mandateID);
  
  // 37) Status (PendingApproval) : Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.statusPayer2, testData.status.PendingApproval);
  
  // 38) Amount (SGD): Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.amountPayer2Value, testData.payer2.amount);
  
  // 39) Transaction Code (92 - Direct Debit(Merchant Payment)) : Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.transactionCodePayer2View, testData.payer2.transactionCode);

  // 40) Particulars: Validate UI Vs Json
  await this.webComponents.compareUIVsJsonValue(this.particularsPayer2Value, testData.payer2.particulars);


  // 41) Next approver Section : Visible
  await this.webComponents.waitElementToBeVisible(this.activityLogSection);
  
  // 42) Approval Details Section : Visible
  await this.webComponents.waitElementToBeVisible(this.approvalDetails);
  
  }

   /**
       * Author : LC5741501
       * This method delete's the PayerOrReference No
       */
   async deleteOpenPayerOrReferenceNo(testData, reference){
    
    // Click : Delete button
    await this.webComponents.clickWhenVisibleAndEnabled(this.deleteButonPayroll);

    // Click : Delete button (Confirm delete Popup)
    await this.webComponents.clickWhenVisibleAndEnabled(this.deleteButonConfirmDeletePopup);

    //Validate : Transaction Deleted Popup Label
    await this.webComponents.waitElementToBeVisible(this.transactionDeletedPopupLabel);
    await this.webComponents.compareUIVsJsonValue(this.transactionDeletedPopupLabel, testData.BulkCollectionValidationData.transactionDeleted);

    // Validate : Refrence No is present in the deleted message
    await this.webComponents.waitElementToBeVisible(this.transactionDeletedPopupLabelMsg);
    await this.webComponents.compareUIVsJsonValue(this.transactionDeletedPopupLabelMsg, reference);
    
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
    await expect(this.hashValue).toBeVisible({ timeout });
    await expect(this.toAccountNumberLabel).toBeVisible({ timeout });
    await expect(this.paymentTypeValue).toBeVisible({ timeout });
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