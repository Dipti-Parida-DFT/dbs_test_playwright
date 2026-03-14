// pages/PaymentsPages.ts
import type { Page } from '@playwright/test';

import { AccountTransferPage } from './AccountTransferPage';
import { TransferCentersPage } from './TransferCenterPage';
import { PayrollPage } from './PayrollPage';
import { BulkPaymentPage } from './BulkPaymentPage';
import { TelegraphicTransferPage } from './TelegraphicTransferPage';
import { ApprovalPage } from './ApprovalPage';
import { BulkCollectionPage } from './BulkCollectionPage';

export {
  AccountTransferPage,
  TransferCentersPage,
  PayrollPage,
  BulkPaymentPage,
  TelegraphicTransferPage,
  ApprovalPage,
  BulkCollectionPage,
 /* LVTPaymentPage,
  AutoPayPaymentPage,
  PaymentViaPartnerBankPage,
  
  TelegraphicTransferPage,
  IntraCompanyTransferPage,
  FastPaymentPage,
  
  NewFastCollectionPage,
  BulkCollectionPage,
  
  MEPSPaymentPage,
  NewBillPaymentPage,
  PaymentTemplatesPage,
  BeneficiaryPage,
  CrossBoarderACHPage,
  HVTPaymentPage,
  CNAPSPaymentPage,
  HKCHATSPaymentPage,
  FPSPaymentPage,
  RTGSPaymentPage,
  SKNPaymentPage,
  ITTPage,
  NEFTPaymentPage,
  FixedDepositPlacementPage,
  PartnerBankPaymentPage,
  TWACHBulkPaymentPage,
  CustomPaymentPage,
  VNLvtPage,
  TWFISCPaymentPage,
  PaymentLimit,
  ChequePaymentPage,
  DemandDraftPaymentPage,
  MT101PaymentPage,
  GiroPaymentPage,
  eACHPaymentPage,
  IBPSPaymentPage,
  RTOLPaymentPage, */
};

export class PaymentsPages {
  public AccountTransferPage: AccountTransferPage;
  public TransferCentersPage: TransferCentersPage;
  public PayrollPage: PayrollPage;
  public BulkPaymentPage: BulkPaymentPage;
  public TelegraphicTransferPage: TelegraphicTransferPage;
  public ApprovalPage: ApprovalPage;
  public BulkCollectionPage: BulkCollectionPage;
  
  constructor(private readonly page: Page) {
    this.AccountTransferPage = new AccountTransferPage(page);
    this.TransferCentersPage = new TransferCentersPage(page);
    this.PayrollPage = new PayrollPage(page);
    this.BulkPaymentPage = new BulkPaymentPage(page);
    this.TelegraphicTransferPage = new TelegraphicTransferPage(page);
    this.ApprovalPage = new ApprovalPage(page);
    this.BulkCollectionPage = new BulkCollectionPage(page);
  }
}
