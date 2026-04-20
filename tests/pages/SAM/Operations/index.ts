import { Page } from '@playwright/test';

import { SchedulesPage } from './SchedulesPage';
import { TransactionEnquiryPage } from './TransactionEnquiryPage';

/**
 * Aggregator for SAM → Operations pages
 * Mirrors the pattern used by PaymentsPages / ApprovalsPages
 */
export class OperationsPages {
  readonly schedulesPage: SchedulesPage;
  readonly transactionEnquiryPage: TransactionEnquiryPage;

  constructor(private readonly page: Page) {
    this.schedulesPage = new SchedulesPage(page);
    this.transactionEnquiryPage = new TransactionEnquiryPage(page);
  }
}