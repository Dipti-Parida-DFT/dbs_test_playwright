// pages/PaymentsPages.ts
import type { Page } from '@playwright/test';

import { AccountTransferPage } from './AccountTransferPage';
import { TransferCentersPage } from './TransferCenterPage';
import { PayrollPage } from './PayrollPage';
import { BulkPaymentPage } from './BulkPaymentPage';
import { TelegraphicTransferPage } from './TelegraphicTransferPage';
import { ApprovalPage } from './ApprovalPage';
import { BulkCollectionPage } from './BulkCollectionPage';
import { PaymentTemplatesPage } from './PaymentTemplatesPage';

export {
  AccountTransferPage,
  TransferCentersPage,
  PayrollPage,
  BulkPaymentPage,
  TelegraphicTransferPage,
  ApprovalPage,
  BulkCollectionPage,
  PaymentTemplatesPage,
};

export class PaymentsPages {
  public AccountTransferPage: AccountTransferPage;
  public TransferCentersPage: TransferCentersPage;
  public PayrollPage: PayrollPage;
  public BulkPaymentPage: BulkPaymentPage;
  public TelegraphicTransferPage: TelegraphicTransferPage;
  public ApprovalPage: ApprovalPage;
  public BulkCollectionPage: BulkCollectionPage;
  public PaymentTemplatesPage: PaymentTemplatesPage;
  
  constructor(private readonly page: Page) {
    this.AccountTransferPage = new AccountTransferPage(page);
    this.TransferCentersPage = new TransferCentersPage(page);
    this.PayrollPage = new PayrollPage(page);
    this.BulkPaymentPage = new BulkPaymentPage(page);
    this.TelegraphicTransferPage = new TelegraphicTransferPage(page);
    this.ApprovalPage = new ApprovalPage(page);
    this.BulkCollectionPage = new BulkCollectionPage(page);
    this.PaymentTemplatesPage = new PaymentTemplatesPage(page);
  }
}
