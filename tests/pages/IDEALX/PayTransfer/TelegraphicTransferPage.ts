// pages/TelegraphicTransferPage.ts
import { Page, Locator, expect, test } from '@playwright/test';
import path from 'node:path';
import { WebComponents } from '../../../lib/webComponents';

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

export type NewSGDTTPayeeInput = {
  name: string;
  nickName: string;
  add1: string;
  add2: string;
  city: string;
  bankId: string;
  accountNumber: string;
  purposeCode: string;
};


export type NewSGDTTPayeeResult = {
  name: string;
  nickName: string;
  add1: string;
  add2: string;
  city: string;
  bankId: string;
  accountNumber: string;
  purposeCode: string;
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

export type PartiourTTPayeeInput = {
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


export type PartiourTTPayeeResult = {
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

  export type AddNewCNPayeeInput = {
    country: string;
    bankId: string;
    routingCode: string;
    accountNumber: string;
    name: string;
    nickName: string;
    payeeLocation: string;  
    city: string;
    add1: string;
    add2: string;
    intermediaryLocation: string;
    intermediaryBankId: string;
    fxAppRefNum: string;
    contractNumber: string;
    invoiceNumber: string;
    transactionRemark1: string;
    amountA1: number;
    bankChargeType: BankChargeType;
    payeeBankMsg: string;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    payeeMsg: string;
    additionalNote: string;
    remitterIdentity: string;
  };

  export type AddNewCNPayeeResult = {
    country: string;
    bankId: string;
    routingCode: string;
    accountNumber: string;
    name: string;
    nickName: string;
    payeeLocation: string;
    city: string;
    add1: string;
    add2: string;
    intermediaryLocation: string;
    intermediaryBankId: string;
    fxAppRefNum: string;
    contractNumber?: string; // Optional
    bankChargeType: BankChargeType;
  };

  export type AddExistingCNPayeeInput = {
    existingAccountNumber: string;
    fxAppRefNum: string;
    contractNumber?: string; // Optional
    invoiceNumber: string;
    transactionRemark1: string;
    amountA2: number;
    bankChargeType: BankChargeType;
    payeeBankMsg: string;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    payeeMsg: string;
    additionalNote: string;
    remitterIdentity: string;
};

  export type AddExistingCNPayeeResult = {
    existingAccountNumber: string;
    fxAppRefNum: string;
    contractNumber?: string;
    invoiceNumber: string;
    transactionRemark1: string;
    amountA2: number;
    bankChargeType: BankChargeType;
    payeeBankMsg: string;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    payeeMsg: string;
    additionalNote: string;
    remitterIdentity: string;
};

  export type AddExistingCNPayeeWithNewCategoryInput = {
    existingAccountNumber: string;
    fxAppRefNum: string;
    contractNumber?: string; // Optional
    invoiceNumber: string;
    transactionRemark1: string;
    amountA2: number;
    bankChargeType: BankChargeType;
    payeeBankMsg: string;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    payeeMsg: string;
    additionalNote: string;
    remitterIdentity: string;
};

  export type AddExistingCNPayeeWithNewCategoryResult = {
    existingAccountNumber: string;
    fxAppRefNum: string;
    contractNumber?: string;
    invoiceNumber: string;
    transactionRemark1: string;
    amountA2: number;
    bankChargeType: BankChargeType;
    payeeBankMsg: string;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    payeeMsg: string;
    additionalNote: string;
    remitterIdentity: string;
};

  export type AddExistingCNPayeeWithNewCategoryAndSeriesInput = {
    existingAccountNumber: string;
    fxAppRefNum: string;
    BOP1Amount: number;
    BOP2Amount: number;
    contractNumber?: string; // Optional
    invoiceNumber: string;
    transactionRemark1: string;
    amountA2: number;
    bankChargeType: BankChargeType;
    payeeBankMsg: string;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    payeeMsg: string;
    additionalNote: string;
    remitterIdentity: string;
};

  export type AddExistingCNPayeeWithNewCategoryAndSeriesResult = {
    existingAccountNumber: string;
    fxAppRefNum: string;
    BOP1Amount: number;
    BOP2Amount: number;
    contractNumber?: string;
    invoiceNumber: string;
    transactionRemark1: string;
    amountA2: number;
    bankChargeType: BankChargeType;
    payeeBankMsg: string;
    email1: string;
    email2: string;
    email3: string;
    email4: string;
    email5: string;
    payeeMsg: string;
    additionalNote: string;
    remitterIdentity: string;
};

















export class TelegraphicTransferPage {
  private readonly webComponents = new WebComponents();

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
    this.inputnewTTBankLocation = page.locator('//input[@id="new-payee-country"]');
    this.inputnewTTBankLocationSGDDropdown = page.locator('//span[contains(text(),"SINGAPORE")]');
    this.newTTSGDbankIDButton = page.locator('//span[contains(text(),"DBSSSGS0XXX")]');
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
    this.newTTSGDPurposeCodeSelect = page.locator('//span[contains(text(),"GSTX - Goods & Services Tax")]');
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
    this.newTTreferenceID = page.locator('//label[contains(text(),"Telegraphic Transfer E")]');
    this.newTTSGDreferenceID = page.locator('//label[contains(text(),"FAST Payment")]');
    this.newTTHashValueLabel = page.locator('//span[@id="ott-view-hashValue"]');
    this.newTTFromAccountViewLabel = page.locator('//span[@id="view-ott-accountNum"]');
    this.newTTSGDFromAccountViewLabel = page.locator('//span[@id="domestic-view-accountNum"]');
    this.newTTPayeeBankLocationLabel = page.locator('//span[@id="ott-view-payee-countryName"]');
    this.newTTPaymentRefLabel = page.locator('//span[@id="ott-view-custRef"]');
    this.newTTRefStatusLabel = page.locator('//div[@id="ott-view-status"]');
    this.newTTSGDRefStatusLabel = page.locator('//div[@id="domestic-view-status"]');
    this.newTTSelectApprovalButton = page.locator('//button[@name="select-approve"]');
    this.newTTCancelButton = page.locator('//button[@name="cancel"]');
    this.newTTAmountValue = page.locator('//span[@class="input value preview-account-label"]');
    this.newTTReferenceValue = page.locator('//div[@id="ott-view-customerReference"]');
    this.newTTSGDReferenceValue = page.locator('//div[@id="domestic-view-customerReference"]');
    this.newTTActivityLog = page.locator('//div[@class="payment-history"]');
    this.newPayeeBankAccountDropdown = page.locator('//span[contains(text(),"02020202")]');

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
    this.templateMenu = page.locator('//a[@*="#/transfers/manage-templates"]');
    this.templateFilter = page.locator('//input[@id="manage-template-filter"]');
    this.templateName = page.locator('//div[@id="ott-viewTemp-templateName"]');
    this.templateLink = page.locator('//a[@id="template-list-templateName_0"]');
    this.templateStatus = page.locator('//div[@id="ott-viewTemp-status"]');
    this.templateAmount = page.locator('//span[@class="preview-account-label edit-label"]');
    this.templateMakeAPaymentButton = page.locator('//button[@name="make-payment"]');
    this.templateApproveButton = page.locator('//button[@name="Approve"]');

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
    this.ttDeletePaymentButton = page.locator('//button[@name="delete"]');
    this.ttDeletePaymentSuccessButton = page.locator('//button[@id="dialogDelete"]');
    this.ttDeletePaymentSuccessMessage = page.locator('//p[@id="labelNoInformationDisplay"]');
    this.partiourPayeeBankAccountDropdown = page.locator('//span[contains(text(),"BAERSGS0XXX")]');
    this.ttApproveButton = page.locator('//button[@name="approve"]');
    this.ttNewApproveButton = page.locator('(//button[@name="approve"])[2]');

    this.CNHPayeeBankAccountDropdown = page.locator('//span[contains(text(),"20191022000011")]');
    this.selectCurrencyDropdown = page.locator('//input[@id="send-currency"]');
    this.CNHPayeeCurrencyDropdown = page.locator('//span[contains(text(),"CNH")]');
    this.CNHPurposeCodeDropdown = page.locator('//div[@id="select-item-Goods trade"]');

    this.ttFXSavingsMessage = page.locator('//div[contains(@class,"alert-disclarimer")]');
    this.baseFXExchangeRate = page.locator('//div[@id="fxDolViewSection"]');
    this.logoutButton = page.locator('//div[@id="logout"]');

    this.newHKPayeeBankAccountDropdown = page.locator('//span[contains(text(),"87654567898")]');
    this.CNYcurrency = page.locator('//span[text()="CNY"]');
    this.existingHKPayeeBankAccountDropdown = page.locator('//span[contains(text(),"ABNACNS0888")]');
    this.unixErrorMessage = page.locator('//div[contains(@class,"alert alert-error")]');
    this.intermediaryCNYLocation = page.locator('//span[text()="MAINLAND CHINA"]');
    this.intermediaryCNYbankID = page.locator('//span[contains(text(),"DBSSCNS0XXX")]');
    this.newHKPurposeCodeDropdown = page.locator('//span[contains(text(),"Goods trade")]');
    this.fromAccountCurrencyDropdown = page.locator('//p-auto-complete[@formcontrolname="currency"]');
    this.fromAccountINRCurrencyDropdown = page.locator('//span[contains(text(),"INR")]');
    this.existingINRPayeeBankAccountDropdown = page.locator('//span[contains(text(),"44321348")]');
    this.intermediaryINRLocation = page.locator('//span[text()="INDIA"]');
    this.intermediaryINRbankID = page.locator('(//span[contains(text(),"CNRBINB0TDC")])[2]');
    this.newINRPurposeCodeDropdown = page.locator('//span[contains(text(),"Indian Companies")]');
    this.payeeMessageDetail = page.locator('//span[@id="payment-details-to-payee"]');
    this.purposeCodeText = page.locator('//span[@id="label-purpose-code"]');

    this.protectionInfoCheckbox0 = page.locator('//input[@id="checkbox_0"]');
    this.protectionInfoCheckbox1 = page.locator('//input[@id="checkbox_1"]');
    this.protectionInfoAcknowledge = page.locator('//button[@class="btn btn__primary"]');
    this.newCNPayeeBankAccountDropdown = page.locator('//span[contains(text(),"2019073000001")]');
    this.SGDPayeeCurrencyDropdown = page.locator('//span[contains(text(),"SGD")]');
    this.inputnewTTBankLocationHongkongDropdown = page.locator('//span[contains(text(),"HONG KONG")]');
    this.newTTHKbankIDButton = page.locator('//span[contains(text(),"DBSSHKH0XXX")]');
    this.locationHongKong = page.locator('//span[text()=" HONG KONG SAR (HK) "]');
    this.newIntermediaryBankLocationAfghanistanDropdown = page.locator('//span[text()="AFGHANISTAN"]');
    this.newIntermediaryBankLocationAfghanistanSelect = page.locator('//span[contains(text(),"ALFHAFK0XXX")]');
    this.countryPartyCNHCode = page.locator('//input[@id="counterptycntryCode"]');
    this.countryPartyAndorraDropdown = page.locator('//span[contains(text(),"ANDORRA")]');
    this.specificPaymentPurpose = page.locator('//input[@id="specPmtPurpose"]');
    this.specificPaymentPurposeDropdown = page.locator('(//span[contains(text(),"Advance Payment")])[1]');
    this.isTaxFreeGoods = page.locator('//input[@id="yes"]');
    this.fxAppRefNum = page.locator('//input[@name="ott-regulatory-advising-approve"]');
    this.pmtBOPCategory1 = page.locator('//input[@id="pmtCategory1"]');
    this.pmtBOPCategory1Dropdown = page.locator('(//span[contains(text(),"Trade Related")])[1]');
    this.pmtBOPCodeSeries1 = page.locator('//input[@id="seriesCode1"]');
    this.pmtBOPCodeSeries1Dropdown = page.locator('//span[contains(text(),"121010")]');
    this.contractNumber = page.locator('//input[@name="ott-regulatory-advising-contractNum"]');
    this.invoiceNumber = page.locator('//input[@name="ott-regulatory-advising-invoiceNum"]');
    this.transactionRemark1 = page.locator('//input[@name="ott-regulatory-advising-transRemark1"]');
    this.uploadDocumentButton = page.locator('//input[@name="digiDoc_file_upload"]');
    this.documentType = page.locator('//input[@id="docType"]');
    this.documentTypeDropdown = page.locator('(//span[contains(text(),"Customs form")])[3]');
    this.utilizedAmount = page.locator('//input[@type="tel"]');
    this.orderingBankMsgCheckbox = page.locator('//input[@id="isMessageToOrderingBank"]');

    this.existingCNPayeeBankAccountDropdown = page.locator('//span[contains(text(),"30001599688")]');
    this.existingCNPaymentNature = page.locator('//input[@id="PaymentNature"]');
    this.existingCNPaymentNatureDropdown = page.locator('(//span[contains(@class,"autocomplete-list")])[1]');
    this.pmtBOPCategory2Dropdown = page.locator('//span[contains(text(),"Capital")]');
    this.pmtBOPCodeSeries2Dropdown = page.locator('(//span[contains(text(),"521010")])[1]');
    this.pmtBOPCategory2 = page.locator('//input[@id="pmtCategory2"]');
    this.pmtBOPCodeSeries2 = page.locator('//input[@id="seriesCode2"]');
    this.pmtBOP1Amount = page.locator('//input[@name="bop-amount-1"]');
    this.pmtBOP2Amount = page.locator('//input[@name="bop-amount-2"]');
    this.pmtBOPCodeSeries3Dropdown = page.locator('(//span[contains(text(),"Capital")])[2]');
    this.pmtBOPCodeSeries4Dropdown = page.locator('(//span[contains(text(),"521010")])[2]');
    this.IDRPayeeCurrencyDropdown = page.locator('//span[contains(text(),"IDR")]');
    }

    readonly authenticate: Locator;
    readonly MYRcurrency: Locator;
    readonly tranferCenterFiler: Locator;
    readonly fromAccount: Locator;
    readonly newPayeeTab: Locator;
    readonly cognitiveContinue: Locator;
    readonly enterNewPayeeBankID: Locator;
    readonly inputnewTTBankLocation: Locator;
    readonly inputnewTTBankLocationSGDDropdown: Locator;
    readonly newTTSGDbankIDButton: Locator;
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
    readonly newTTSGDPurposeCodeSelect: Locator;
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
    readonly newTTSGDreferenceID: Locator;
    readonly newTTHashValueLabel: Locator;
    readonly newTTFromAccountViewLabel: Locator;
    readonly newTTPayeeBankLocationLabel: Locator;
    readonly newTTPaymentRefLabel: Locator;
    readonly newTTRefStatusLabel: Locator;
    readonly newTTSGDRefStatusLabel: Locator;
    readonly newTTSelectApprovalButton: Locator;
    readonly newTTCancelButton: Locator;
    readonly newTTAmountValue: Locator;
    readonly newTTReferenceValue: Locator;
    readonly newTTSGDReferenceValue: Locator;
    readonly newTTActivityLog: Locator;
    readonly newTTSGDFromAccountViewLabel: Locator;
    readonly newPayeeBankAccountDropdown: Locator;

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
    readonly templateName: Locator;
    readonly templateAmount: Locator;
    readonly templateMakeAPaymentButton: Locator;
    readonly templateStatus: Locator;
    readonly templateApproveButton: Locator;

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
    readonly ttDeletePaymentButton: Locator;
    readonly ttDeletePaymentSuccessButton: Locator;
    readonly ttDeletePaymentSuccessMessage: Locator;
    readonly partiourPayeeBankAccountDropdown: Locator;
    readonly ttApproveButton: Locator;
    readonly ttNewApproveButton: Locator;
    readonly CNHPayeeBankAccountDropdown: Locator;
    readonly selectCurrencyDropdown: Locator;
    readonly CNHPayeeCurrencyDropdown: Locator;
    readonly CNHPurposeCodeDropdown: Locator;

    readonly ttFXSavingsMessage: Locator;
    readonly baseFXExchangeRate: Locator;
    readonly logoutButton: Locator;

    readonly newHKPayeeBankAccountDropdown: Locator;
    readonly CNYcurrency: Locator;
    readonly existingHKPayeeBankAccountDropdown: Locator;
    readonly unixErrorMessage: Locator;
    readonly intermediaryCNYLocation: Locator;
    readonly intermediaryCNYbankID: Locator;
    readonly newHKPurposeCodeDropdown: Locator;
    readonly fromAccountCurrencyDropdown: Locator;
    readonly fromAccountINRCurrencyDropdown: Locator;
    readonly existingINRPayeeBankAccountDropdown: Locator;
    readonly intermediaryINRLocation: Locator;
    readonly intermediaryINRbankID: Locator;
    readonly newINRPurposeCodeDropdown: Locator;
    readonly payeeMessageDetail: Locator;
    readonly purposeCodeText: Locator;
    readonly protectionInfoCheckbox0: Locator;
    readonly protectionInfoCheckbox1: Locator;
    readonly protectionInfoAcknowledge: Locator;
    readonly SGDPayeeCurrencyDropdown: Locator;
    readonly newCNPayeeBankAccountDropdown: Locator;
    readonly inputnewTTBankLocationHongkongDropdown: Locator;
    readonly newTTHKbankIDButton: Locator;
    readonly locationHongKong: Locator;
    readonly newIntermediaryBankLocationAfghanistanDropdown: Locator;
    readonly newIntermediaryBankLocationAfghanistanSelect: Locator;
    readonly countryPartyCNHCode: Locator;
    readonly countryPartyAndorraDropdown: Locator;
    readonly specificPaymentPurpose: Locator;
    readonly specificPaymentPurposeDropdown: Locator;
    readonly isTaxFreeGoods: Locator;
    readonly fxAppRefNum: Locator;
    readonly pmtBOPCategory1: Locator;
    readonly pmtBOPCategory1Dropdown: Locator;
    readonly pmtBOPCodeSeries1: Locator;
    readonly pmtBOPCodeSeries1Dropdown: Locator;
    readonly contractNumber: Locator;
    readonly invoiceNumber: Locator;
    readonly transactionRemark1: Locator;
    readonly uploadDocumentButton: Locator;
    readonly documentType: Locator;
    readonly documentTypeDropdown: Locator;
    readonly utilizedAmount : Locator;
    readonly orderingBankMsgCheckbox: Locator;

    readonly existingCNPayeeBankAccountDropdown: Locator;
    readonly existingCNPaymentNature: Locator;
    readonly existingCNPaymentNatureDropdown: Locator;
    readonly pmtBOPCategory2Dropdown: Locator;
    readonly pmtBOPCodeSeries2Dropdown: Locator;
    readonly pmtBOPCategory2: Locator;
    readonly pmtBOPCodeSeries2: Locator;
    readonly pmtBOP1Amount: Locator;
    readonly pmtBOP2Amount: Locator;
    readonly pmtBOPCodeSeries3Dropdown: Locator;
    readonly pmtBOPCodeSeries4Dropdown: Locator;
    readonly IDRPayeeCurrencyDropdown: Locator;

  private async selectBankCharge(charge: BankChargeType) {
  switch (charge) {
    case 'OUR':
      await this.bankChargesOurRadioButton.evaluate(el => (el as HTMLElement).click());
      break;
    case 'SHARED':
      await this.bankChargesSharedRadioButton.evaluate(el => (el as HTMLElement).click());
      break;
    case 'THEY':
      await this.bankChargesTheyRadioButton.evaluate(el => (el as HTMLElement).click());
      break;
    default:
      throw new Error(`Unsupported bank charge: ${charge}`);
  }
}
  
  /**
   * Author: LC5741501
   * Upload a PDF document using the file upload input.
   * @param filePath - Absolute path to the PDF file to upload
   * @param timeout - Optional timeout in milliseconds
   */
  async uploadSupportingDocument(fileName: string) {
    const filePath = path.join(process.cwd(), 'tests', 'data', fileName);
    await this.uploadDocumentButton.scrollIntoViewIfNeeded();
    await this.uploadDocumentButton.setInputFiles(filePath);
    await this.waitForUXLoading();
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

  async safeClick(locator: Locator, timeout = 150_000) {
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

    if (await acknowledgeBtn.isVisible({ timeout: 50_000 }).catch(() => false)) {
        await acknowledgeBtn.click();
        await this.page.waitForLoadState('networkidle');
    }
}

  async waitForCurrency(timeout = 1000) {
    return await this.MYRcurrency.isVisible({ timeout }).catch(() => false);
  }

  async waitForTTFormReady(timeout = 150_000) {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.waitForUXLoading();
    await expect(this.fromAccount).toBeVisible({ timeout });
    await expect(this.fromAccount).toBeEnabled({ timeout });
  }

  async handleCognitiveContinueIfPresent() {
    try {
    await this.cognitiveContinue.waitFor({ state: 'visible', timeout: 5000 });
    await this.saferClick(this.cognitiveContinue);
    await this.waitForUXLoading();
  } catch {
    // popup did not appear → continue safely
  }
}

  async waitForNewPayeeFormReady(timeout = 120_000) {
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

  async newTTWaitForViewPaymentPageReady(timeout = 150_000) {
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
      const template = `Template${Date.now()}`;
      await this.safeFill(this.ttSaveAsTemplateInput, template);
      await this.page.keyboard.press('Tab');
      await this.ttSaveAsTemplateInput.blur();
      return template;
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
    await this.waitForUXLoading();
    await expect(this.templateLink).toBeVisible({ timeout: 150_000 });
    // await this.safeClick(this.templateLink);
    await this.templateLink.click();
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

  async waitForDeletePaymentSuccess(timeout = 15_000) {
    await this.waitForUXLoading();
    await expect(this.ttRejectPaymentSuccessMessage).toBeVisible({ timeout });
    await expect(this.ttDeletePaymentSuccessButton).toBeEnabled({ timeout });
    await this.saferClick(this.ttDeletePaymentSuccessButton);
  }

  async waitForSGNewPayeeFormReady(timeout = 120_000) {
    await this.page.waitForLoadState('domcontentloaded');
    await this.page.waitForLoadState('networkidle');
    await this.waitForUXLoading();
    await expect(this.inputnewTTBankLocation).toBeVisible({ timeout });
    await expect(this.inputnewTTBankLocation).toBeEnabled({ timeout });
  }

  async addNewSGTTPayee(input: NewSGDTTPayeeInput): Promise<NewSGDTTPayeeResult> {
    const { name, nickName, city, add1, add2, bankId, accountNumber, purposeCode } = input;
      await this.safeClick(this.newPayeeTab)
      await this.handleCognitiveContinueIfPresent();
      await this.waitForSGNewPayeeFormReady();
      await this.inputnewTTBankLocation.click();
      await this.safeFill(this.inputnewTTBankLocation, 'SINGAPORE');
      await this.safeClick(this.inputnewTTBankLocationSGDDropdown);
      await this.enterNewPayeeBankID.waitFor({ state: 'visible' });
      await this.enterNewPayeeBankID.fill(bankId);
      await this.page.keyboard.press('Enter');
      await this.enterNewPayeeBankID.blur();
      await this.safeClick(this.newTTSGDbankIDButton);

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

      await this.newTTPurposeCode.click();
      await this.safeClick(this.inputNewTTPurposeCode);
      await this.safeFill(this.inputNewTTPurposeCode, purposeCode);
      await this.safeClick(this.newTTSGDPurposeCodeSelect);
      await this.newTTPurposeCode.blur();
      return { name, nickName, city, add1, add2, bankId, accountNumber, purposeCode };
}
  async getNewSGDTTReferenceText(): Promise<string> {
    const raw = await this.newTTSGDreferenceID.textContent();
    return (raw ?? '').trim();
  }

  async getNewSGDTTReferenceID(): Promise<string> {
    const raw = await this.getNewSGDTTReferenceText();
    const match = raw.match(/\b(EB[A-Z0-9-]+)\b/i);
    return match?.[1] ?? '';
  }

  async newTTSGDWaitForViewPaymentPageReady(timeout = 25_000) {
    await this.waitForUXLoading();
    await expect(this.newTTSGDFromAccountViewLabel).toBeVisible({ timeout });
  }

async clickNextUntilPreview(timeout = 250_000) {
  for (let i = 0; i < 5; i++) {
    await this.safeClick(this.newTTPayeeNextButton);

    try {
      await this.waitForNewTTPreviewPageReady();
      return;
    } catch {}
  }

  throw new Error("Preview page did not load after multiple attempts");
}

async addPartiourTTPayee(input: PartiourTTPayeeInput): Promise<PartiourTTPayeeResult> {
    const {existingAccountNumber, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity } = input;
      await this.safeClick(this.existingPayeeTab)

      await this.safeClick(this.existingPayeeBankAccount);
      await this.safeFill(this.existingPayeeBankAccount, existingAccountNumber);
      await this.existingPayeeBankAccount.blur();
      await this.safeClick(this.partiourPayeeBankAccountDropdown);

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

 async clickApproval(timeout = 250_000) {
  for (let i = 0; i < 5; i++) {
    await this.safeClick(this.ttNewApproveButton.first());

    try {
      await this.waitForDeletePaymentSuccess();
      return;
    } catch {}
  }

  throw new Error("Approve page did not load after multiple attempts");
}

 async waitForCNYCurrency(timeout = 1000) {
    return await this.CNYcurrency.isVisible({ timeout }).catch(() => false);
  }

  async waitForProtectionMessage() {
    await this.waitForUXLoading();
    await this.protectionInfoCheckbox0.evaluate(el => (el as HTMLElement).click());
    await this.protectionInfoCheckbox1.evaluate(el => (el as HTMLElement).click());
    await this.webComponents.clickWhenVisibleAndEnabled(this.protectionInfoAcknowledge); 
    await this.page.waitForLoadState('networkidle');
  }

  async addNewCNTTPayee(input: AddNewCNPayeeInput): Promise<AddNewCNPayeeResult> {
    const { country, bankId, routingCode, accountNumber, name, nickName, payeeLocation, city, add1, add2, intermediaryLocation, intermediaryBankId, fxAppRefNum, contractNumber, invoiceNumber, transactionRemark1, amountA1, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity } = input;
      await this.webComponents.clickWhenVisibleAndEnabled(this.newPayeeTab);
      await this.waitForSGNewPayeeFormReady();
      await this.webComponents.enterTextarea(this.inputnewTTBankLocation, country);
      await this.webComponents.clickWhenVisibleAndEnabled(this.inputnewTTBankLocationHongkongDropdown);
      await this.webComponents.enterTextarea(this.enterNewPayeeBankID, bankId);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Enter');
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingPayeeBankAccountSelect);
      await this.enterNewPayeeBankID.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.inputRoutingNumber);
      await this.webComponents.enterTextarea(this.inputRoutingNumber, routingCode);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.inputRoutingNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeAccountNumber);
      await this.webComponents.enterTextarea(this.newTTPayeeAccountNumber, accountNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeAccountNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeName);
      await this.webComponents.enterTextarea(this.newTTPayeeName, name);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeName.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeNickname);
      await this.webComponents.enterTextarea(this.newTTPayeeNickname, nickName);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeNickname.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.payeeLocation);
      await this.webComponents.typeTextThroughKeyBoardAction(this.page, payeeLocation);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'ArrowDown');
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Enter');

      await this.webComponents.clickWhenVisibleAndEnabled(this.newPayeeCity);
      await this.webComponents.enterTextarea(this.newPayeeCity, city);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newPayeeCity.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeAddress1);
      await this.webComponents.enterTextarea(this.newTTPayeeAddress1, add1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeAddress1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeAddress2);
      await this.webComponents.enterTextarea(this.newTTPayeeAddress2, add2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeAddress2.blur();

      await this.intermediaryBankCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.intermediaryBankLocation);
      await this.webComponents.typeTextThroughKeyBoardAction(this.page, intermediaryLocation);
      await this.webComponents.clickWhenVisibleAndEnabled(this.newIntermediaryBankLocationAfghanistanDropdown);
      
      await this.intermediaryBankId.waitFor({ state: 'visible' });
      await this.webComponents.enterTextarea(this.intermediaryBankId, intermediaryBankId);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Enter');
      await this.webComponents.clickWhenVisibleAndEnabled(this.newIntermediaryBankLocationAfghanistanSelect);
      await this.intermediaryBankId.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyCNHCode);
      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyAndorraDropdown);
      await this.countryPartyCNHCode.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurpose);
      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurposeDropdown);
      await this.specificPaymentPurpose.blur();

      await this.isTaxFreeGoods.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.fxAppRefNum);
      await this.webComponents.enterTextarea(this.fxAppRefNum, fxAppRefNum);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.fxAppRefNum.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory1Dropdown);
      await this.pmtBOPCategory1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries1Dropdown);
      await this.pmtBOPCodeSeries1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.contractNumber);
      await this.webComponents.enterTextarea(this.contractNumber, contractNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.contractNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.invoiceNumber);
      await this.webComponents.enterTextarea(this.invoiceNumber, invoiceNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.invoiceNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.transactionRemark1);
      await this.webComponents.enterTextarea(this.transactionRemark1, transactionRemark1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.transactionRemark1.blur();

      await this.uploadSupportingDocument('DIGI_DOC.pdf');

      await this.webComponents.clickWhenVisibleAndEnabled(this.documentType);
      await this.webComponents.clickWhenVisibleAndEnabled(this.documentTypeDropdown);
      await this.documentType.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.utilizedAmount);
      await this.webComponents.enterTextarea(this.utilizedAmount, amountA1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.utilizedAmount.blur();      
     
      await this.selectBankCharge(bankChargeType);

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPaymentRemark);
      await this.webComponents.enterTextarea(this.newTTPaymentRemark, payeeBankMsg);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPaymentRemark.blur();

      await this.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail1);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail1, email1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail2);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail2, email2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail2.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail3);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail3, email3);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail3.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail4);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail4, email4);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail4.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail5);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail5, email5);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail5.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeRemark);
      await this.webComponents.enterTextarea(this.newTTPayeeRemark, payeeMsg);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab'); 
      await this.newTTPayeeRemark.blur();

      await this.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.additionalNoteRemark);
      await this.webComponents.enterTextarea(this.additionalNoteRemark, additionalNote);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.additionalNoteRemark.blur();

      await this.orderingBankMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.orderingBankMsg);
      await this.webComponents.enterTextarea(this.orderingBankMsg, remitterIdentity);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.orderingBankMsg.blur();

      return { country, bankId, routingCode, accountNumber, name, nickName, payeeLocation, city, add1, add2, intermediaryLocation, intermediaryBankId, fxAppRefNum, contractNumber, invoiceNumber, transactionRemark1, amountA1, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity };
 };

  async addExistingCNTTPayee(input: AddExistingCNPayeeInput): Promise<AddExistingCNPayeeResult> {
    const { existingAccountNumber, fxAppRefNum, contractNumber, invoiceNumber, transactionRemark1, amountA2, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity } = input;
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingPayeeTab)
      await expect(this.existingPayeeBankAccount).toBeVisible({ timeout: 120_000 });
      await expect(this.existingPayeeBankAccount).toBeEnabled({ timeout: 120_000 });

      await this.webComponents.clickWhenVisibleAndEnabled(this.existingPayeeBankAccount);
      await this.webComponents.typeTextThroughKeyBoardAction(this.page, existingAccountNumber);
      
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPayeeBankAccountDropdown);
      await this.existingPayeeBankAccount.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyCNHCode);
      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyAndorraDropdown);
      await this.countryPartyCNHCode.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurpose);
      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurposeDropdown);
      await this.specificPaymentPurpose.blur();

      await this.isTaxFreeGoods.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPaymentNature);
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPaymentNatureDropdown);
      await this.existingCNPaymentNature.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.fxAppRefNum);
      await this.webComponents.enterTextarea(this.fxAppRefNum, fxAppRefNum);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.fxAppRefNum.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory1Dropdown);
      await this.pmtBOPCategory1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries1Dropdown);
      await this.pmtBOPCodeSeries1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.contractNumber);
      await this.webComponents.enterTextarea(this.contractNumber, contractNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.contractNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.invoiceNumber);
      await this.webComponents.enterTextarea(this.invoiceNumber, invoiceNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.invoiceNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.transactionRemark1);
      await this.webComponents.enterTextarea(this.transactionRemark1, transactionRemark1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.transactionRemark1.blur();

      await this.uploadSupportingDocument('DIGI_DOC.pdf');

      await this.webComponents.clickWhenVisibleAndEnabled(this.documentType);
      await this.webComponents.clickWhenVisibleAndEnabled(this.documentTypeDropdown);
      await this.documentType.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.utilizedAmount);
      await this.webComponents.enterTextarea(this.utilizedAmount, amountA2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.utilizedAmount.blur();  

      await this.selectBankCharge(bankChargeType);

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPaymentRemark);
      await this.webComponents.enterTextarea(this.newTTPaymentRemark, payeeBankMsg);
      await this.newTTPaymentRemark.blur();

      await this.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail1);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail1, email1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail2);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail2, email2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail2.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail3);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail3, email3);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail3.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail4);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail4, email4);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail4.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail5);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail5, email5);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail5.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeRemark);
      await this.webComponents.enterTextarea(this.newTTPayeeRemark, payeeMsg);
      await this.newTTPayeeRemark.blur();

      await this.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.additionalNoteRemark);
      await this.webComponents.enterTextarea(this.additionalNoteRemark, additionalNote);
      await this.additionalNoteRemark.blur();

      await this.webComponents.javaScriptsClick(this.orderingBankMsgCheckbox);
      await this.webComponents.clickWhenVisibleAndEnabled(this.orderingBankMsg);
      await this.webComponents.enterTextarea(this.orderingBankMsg, remitterIdentity);
      await this.orderingBankMsg.blur();

      return { existingAccountNumber, fxAppRefNum, contractNumber, invoiceNumber, transactionRemark1, amountA2, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity };
 };

 async addExistingCNTTPayeeWithNewCategory(input: AddExistingCNPayeeWithNewCategoryInput): Promise<AddExistingCNPayeeWithNewCategoryResult> {
    const { existingAccountNumber, fxAppRefNum, contractNumber, invoiceNumber, transactionRemark1, amountA2, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity } = input;
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingPayeeTab)
      await expect(this.existingPayeeBankAccount).toBeVisible({ timeout: 120_000 });
      await expect(this.existingPayeeBankAccount).toBeEnabled({ timeout: 120_000 });

      await this.webComponents.clickWhenVisibleAndEnabled(this.existingPayeeBankAccount);
      await this.webComponents.typeTextThroughKeyBoardAction(this.page, existingAccountNumber);
      
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPayeeBankAccountDropdown);
      await this.existingPayeeBankAccount.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyCNHCode);
      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyAndorraDropdown);
      await this.countryPartyCNHCode.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurpose);
      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurposeDropdown);
      await this.specificPaymentPurpose.blur();

      await this.isTaxFreeGoods.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPaymentNature);
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPaymentNatureDropdown);
      await this.existingCNPaymentNature.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.fxAppRefNum);
      await this.webComponents.enterTextarea(this.fxAppRefNum, fxAppRefNum);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.fxAppRefNum.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory2Dropdown);
      await this.pmtBOPCategory1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries2Dropdown);
      await this.pmtBOPCodeSeries1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.contractNumber);
      await this.webComponents.enterTextarea(this.contractNumber, contractNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.contractNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.invoiceNumber);
      await this.webComponents.enterTextarea(this.invoiceNumber, invoiceNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.invoiceNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.transactionRemark1);
      await this.webComponents.enterTextarea(this.transactionRemark1, transactionRemark1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.transactionRemark1.blur();

      await this.uploadSupportingDocument('DIGI_DOC.pdf');

      await this.webComponents.clickWhenVisibleAndEnabled(this.documentType);
      await this.webComponents.clickWhenVisibleAndEnabled(this.documentTypeDropdown);
      await this.documentType.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.utilizedAmount);
      await this.webComponents.enterTextarea(this.utilizedAmount, amountA2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.utilizedAmount.blur();  

      await this.selectBankCharge(bankChargeType);

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPaymentRemark);
      await this.webComponents.enterTextarea(this.newTTPaymentRemark, payeeBankMsg);
      await this.newTTPaymentRemark.blur();

      await this.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail1);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail1, email1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail2);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail2, email2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail2.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail3);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail3, email3);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail3.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail4);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail4, email4);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail4.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail5);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail5, email5);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail5.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeRemark);
      await this.webComponents.enterTextarea(this.newTTPayeeRemark, payeeMsg);
      await this.newTTPayeeRemark.blur();

      await this.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.additionalNoteRemark);
      await this.webComponents.enterTextarea(this.additionalNoteRemark, additionalNote);
      await this.additionalNoteRemark.blur();

      await this.orderingBankMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.orderingBankMsg);
      await this.webComponents.enterTextarea(this.orderingBankMsg, remitterIdentity);
      await this.orderingBankMsg.blur();

      return { existingAccountNumber, fxAppRefNum, contractNumber, invoiceNumber, transactionRemark1, amountA2, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity };
 };

 async addExistingCNTTPayeeWithNewCategoryAndSeries(input: AddExistingCNPayeeWithNewCategoryAndSeriesInput): Promise<AddExistingCNPayeeWithNewCategoryAndSeriesResult> {
    const { existingAccountNumber, fxAppRefNum, BOP1Amount, BOP2Amount, contractNumber, invoiceNumber, transactionRemark1, amountA2, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity } = input;
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingPayeeTab)
      await expect(this.existingPayeeBankAccount).toBeVisible({ timeout: 120_000 });
      await expect(this.existingPayeeBankAccount).toBeEnabled({ timeout: 120_000 });

      await this.webComponents.clickWhenVisibleAndEnabled(this.existingPayeeBankAccount);
      await this.webComponents.typeTextThroughKeyBoardAction(this.page, existingAccountNumber);
      
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPayeeBankAccountDropdown);
      await this.existingPayeeBankAccount.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyCNHCode);
      await this.webComponents.clickWhenVisibleAndEnabled(this.countryPartyAndorraDropdown);
      await this.countryPartyCNHCode.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurpose);
      await this.webComponents.clickWhenVisibleAndEnabled(this.specificPaymentPurposeDropdown);
      await this.specificPaymentPurpose.blur();

      await this.isTaxFreeGoods.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPaymentNature);
      await this.webComponents.clickWhenVisibleAndEnabled(this.existingCNPaymentNatureDropdown);
      await this.existingCNPaymentNature.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.fxAppRefNum);
      await this.webComponents.enterTextarea(this.fxAppRefNum, fxAppRefNum);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.fxAppRefNum.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory2Dropdown);
      await this.pmtBOPCategory1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries1);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries2Dropdown);
      await this.pmtBOPCodeSeries1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCategory2);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries3Dropdown);
      await this.pmtBOPCategory2.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries2);
      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOPCodeSeries4Dropdown);
      await this.pmtBOPCodeSeries2.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOP1Amount);
      await this.webComponents.enterTextarea(this.pmtBOP1Amount, BOP1Amount);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.pmtBOP1Amount.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.pmtBOP2Amount);
      await this.webComponents.enterTextarea(this.pmtBOP2Amount, BOP2Amount);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.pmtBOP2Amount.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.contractNumber);
      await this.webComponents.enterTextarea(this.contractNumber, contractNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.contractNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.invoiceNumber);
      await this.webComponents.enterTextarea(this.invoiceNumber, invoiceNumber);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.invoiceNumber.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.transactionRemark1);
      await this.webComponents.enterTextarea(this.transactionRemark1, transactionRemark1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.transactionRemark1.blur();

      await this.uploadSupportingDocument('DIGI_DOC.pdf');

      await this.webComponents.clickWhenVisibleAndEnabled(this.documentType);
      await this.webComponents.clickWhenVisibleAndEnabled(this.documentTypeDropdown);
      await this.documentType.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.utilizedAmount);
      await this.webComponents.enterTextarea(this.utilizedAmount, amountA2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.utilizedAmount.blur();  

      await this.selectBankCharge(bankChargeType);

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPaymentRemark);
      await this.webComponents.enterTextarea(this.newTTPaymentRemark, payeeBankMsg);
      await this.newTTPaymentRemark.blur();

      await this.newTTPayeeMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail1);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail1, email1);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail1.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail2);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail2, email2);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail2.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail3);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail3, email3);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail3.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail4);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail4, email4);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail4.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeEmail5);
      await this.webComponents.enterTextarea(this.newTTPayeeEmail5, email5);
      await this.webComponents.pressGivenButtonThroughKeyBoardAction(this.page, 'Tab');
      await this.newTTPayeeEmail5.blur();

      await this.webComponents.clickWhenVisibleAndEnabled(this.newTTPayeeRemark);
      await this.webComponents.enterTextarea(this.newTTPayeeRemark, payeeMsg);
      await this.newTTPayeeRemark.blur();

      await this.additionalNoteCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.additionalNoteRemark);
      await this.webComponents.enterTextarea(this.additionalNoteRemark, additionalNote);
      await this.additionalNoteRemark.blur();

      await this.orderingBankMsgCheckbox.evaluate(el => (el as HTMLElement).click());

      await this.webComponents.clickWhenVisibleAndEnabled(this.orderingBankMsg);
      await this.webComponents.enterTextarea(this.orderingBankMsg, remitterIdentity);
      await this.orderingBankMsg.blur();

      return { existingAccountNumber, fxAppRefNum, BOP1Amount, BOP2Amount, contractNumber, invoiceNumber, transactionRemark1, amountA2, bankChargeType, payeeBankMsg, email1, email2, email3, email4, email5, payeeMsg, additionalNote, remitterIdentity };
 };

};