import { Page } from '@playwright/test';

import { MyVerificationAndReleasePage } from './MyVerificationAndReleasePage';
import { ApprovalPage } from './ApprovalPage';

import { TransferCentersPage } from '../PayTransfer/TransferCenterPage';
import { AccountTransferPage } from '../PayTransfer/AccountTransferPage';

/**
 * Aggregator for Approval-related pages
 * Mirrors the Playwright structure of PaymentsPages and OperationsPages
 */
export class ApprovalsPages {
  readonly MyVerificationAndReleasePage: MyVerificationAndReleasePage;
  readonly ApprovalPage: ApprovalPage;
  readonly transferCentersPage: TransferCentersPage;
  readonly accountTransferPage: AccountTransferPage;

  constructor(private readonly page: Page) {
    this.MyVerificationAndReleasePage = new MyVerificationAndReleasePage(page);
    this.ApprovalPage = new ApprovalPage(page);
    this.transferCentersPage = new TransferCentersPage(page);
    this.accountTransferPage = new AccountTransferPage(page);
  }
}

/**
 * Optional named exports (kept for compatibility with older imports)
 */
export {
  MyVerificationAndReleasePage,
  ApprovalPage,
  TransferCentersPage,
  AccountTransferPage,
};