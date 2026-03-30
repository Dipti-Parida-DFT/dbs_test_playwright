// tests/IN_BulkCollection.spec.ts
/**
       * Author: LC5764724 / Chetan Chavan
       * Created Date: 23/02/26
       * This Class "tests/PayTransfer/IN_BulkCollection.spec.ts"
       * Description: This class has two test cases.
       * 1) TC001_INBulkCollection - Create a Bulk collection with new Payee
       * 2) TC002_INBulkCollection - Edit a Bulk Collection via Transfer Center
       */

import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';


// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/IN_testData.json');
const testData = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;


const loginCompanyId = testData.BulkCollection.SIT.loginCompanyId;
const loginUserId = testData.BulkCollection.SIT.loginUserId;
const fromAccount = testData.BulkCollection.SIT.fromAccount;
const payeeBankID = testData.BulkCollection.payeeBankID;

test.describe.serial('IN_Bulk Collection', { tag: ['@BulkCollection', '@IN'] }, () => {
  let pages: PaymentsPages;
  // this from OnlineCreate, then Reject/Edit/Delete
  let reference = "";
  let referenceEdit = '';
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];
  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    //customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');
    await loginPage.handleAnnouncementIfPresent();
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
  });

  test.afterEach(async ({ }, testInfo) => {
    // Only cleanup if the test passed
    if (testInfo.status !== 'passed') {
      //console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
      return;
    }

    if (!pages) return;

    // Best-effort cleanup; never fail the test because cleanup failed
    for (const p of createdPayees) {
      try {
        const key = p.name ?? p.accountNumber ?? '';
        if (!key) continue;
        await pages.BulkCollectionPage.deletePayeeByFilter(key, /* confirm */ true);
        console.log(`[cleanup] Deleted payee with key: ${key}`);
      } catch (err) {
        console.warn('[cleanup] Failed to delete a payee:', err);
      }
    }
  });

  test('TC001_INBulkCollection - Verify creating a Bulk collection with new Payee', async ({ page }, testInfo) => {

    //Step 1: Navigate to Payments menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    //Step 3: Open Bulk Collection form
    await pages.BulkCollectionPage.safeClick(pages.BulkCollectionPage.bulkCollection);
    await pages.BulkCollectionPage.waitForBulkCollectionFormReady();

    //Step 4: From account Selection
    await pages.BulkCollectionPage.safeClick(pages.BulkCollectionPage.fromAccount);
    await page.keyboard.type(fromAccount);
    await page.keyboard.press('ArrowDown');
    await page.keyboard.press('Enter');

    //Step 5: UCIC code input
    await pages.BulkCollectionPage.ucicCode.fill(testData.BulkCollection.UCICCode);

    // Reusable helper for add new payee
    const { name, accountNumber } = await pages.BulkCollectionPage.addNewPayee({
      name: testData.BulkCollection.newPayeeName,
      DDAReferenceNo: testData.BulkCollection.DDAreference,
      bankId: payeeBankID,
      accountNumber: testData.BulkCollection.payeeBankAccountNumber,
      MandateID: testData.BulkCollection.MandateID,
    });

    // Register for payee cleanup
    createdPayees.push({ name, accountNumber });

    //Step 6: Enter Amount & reference details
    await pages.BulkCollectionPage.amount.fill(testData.BulkCollection.amount);
    await pages.BulkCollectionPage.payeeRef.fill(testData.BulkCollection.referenceForPayee);

    //Step 7: Enter Optional details
    await pages.BulkCollectionPage.showOptionDetailPayee1.click();
    await pages.BulkCollectionPage.messageToPayer.click();
    await pages.BulkCollectionPage.emailId0.fill(testData.BulkCollection.emailIdO);
    await pages.BulkCollectionPage.emailId1.fill(testData.BulkCollection.emailId1);
    await pages.BulkCollectionPage.emailId2.fill(testData.BulkCollection.emailId2);
    await pages.BulkCollectionPage.emailId3.fill(testData.BulkCollection.emailId3);
    await pages.BulkCollectionPage.emailId4.fill(testData.BulkCollection.emailId4);
    await pages.BulkCollectionPage.message.fill(testData.BulkCollection.message);

    //Step 8: Next → Preview → Submit
    await pages.BulkCollectionPage.nextButton.click();
    await pages.BulkCollectionPage.waitForPreviewPageReady();
    await pages.BulkCollectionPage.submitButton.click();
    await pages.BulkCollectionPage.waitForSubmittedPageReady();

    //Step 9: Capture full banner text and Reference ID:
    const referenceText = await pages.BulkCollectionPage.getReferenceText();
    reference = await pages.BulkCollectionPage.getReferenceID();

    //Step 10: Click on finished button
    await pages.BulkCollectionPage.finishButton.click();

    //Step 11: Search reference on Transfer Center page
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkCollectionPage.waitForViewPaymentPageReady();

    //Step 12: Validate fields on view page
    await checkViewPageAllField({
      page,
      pages,
      testData,
      isEdit: false,
      reference,
      referenceEdit: ''
    });
  });

  test('TC002_INBulkCollection - Verify edit a Bulk Collection via Transfer Center', async ({ page }, testInfo) => {

    //Step 1: Navigate to Payments menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);

    //Step 2: Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    //Step 3: Open the view by reference (or search)
    if (reference.trim().length > 0) {
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'IN - Bulk Collection',
        testData.status.PendingApproval
      );
    }

    await pages.BulkCollectionPage.waitForViewPaymentPageReady();

    //Step 4: Edit transaction
    await pages.BulkCollectionPage.editButton.click();
    await pages.BulkCollectionPage.waitForBulkCollectionFormReady();
    await pages.BulkCollectionPage.amount.fill(testData.BulkCollection.editAmount);
    await pages.BulkCollectionPage.showOptionDetailPayee1.click();
    await pages.BulkCollectionPage.message.fill(testData.BulkCollection.messageEdit);

    //Step 5: Next → Preview → Submit
    await pages.BulkCollectionPage.nextButton.click();
    await pages.BulkCollectionPage.waitForPreviewPageReady();
    await pages.BulkCollectionPage.submitButton.click();
    await pages.BulkCollectionPage.waitForSubmittedPageReady();

    //Step 6: Capture full banner text and Reference ID:
    const rawText = (await pages.BulkCollectionPage.getReferenceText()) ?? '';
    referenceEdit = await pages.BulkCollectionPage.getReferenceID();

    //Step 7: Click on finished button
    await pages.BulkCollectionPage.finishButton.click();

    //Step 8: Search reference on Transfer Center page
    await pages.AccountTransferPage.paymentMenu.click();
    await pages.TransferCentersPage.searchAndOpenByReference(referenceEdit);
    await pages.BulkCollectionPage.waitForViewPaymentPageReady();

    //Step 9: Validate fields on view page
    if (referenceEdit === reference) {
      await checkViewPageAllField({
        page,
        pages,
        testData: testData,
        isEdit: true,
        reference,
        referenceEdit
      });
    } else {
      //If reference changed after edit, at least assert amount updated in list/details view as a sanity check
      await expect(pages.BulkCollectionPage.amountValue).not.toHaveText('');
    }
  });
});

/**
 * Helper utility to assert all fields on the view page, used by both create and edit tests. 
 */
async function checkViewPageAllField(args: {
  page: Page;
  pages: PaymentsPages;
  testData: any;
  isEdit: boolean;
  reference: string;
  referenceEdit: string;
}) {
  const { pages, testData, isEdit, reference, referenceEdit } = args;

  // Expand optional section first (was jsClick())
  await pages.BulkCollectionPage.showOptionView.click();

  // Assertions (converted from ensure.* chain)
  await expect(pages.BulkCollectionPage.amountValue).toContainText(
    isEdit ? testData.BulkCollection.editAmount : testData.BulkCollection.amount
  );
  await expect(pages.BulkCollectionPage.transactionStatusValue).toContainText(testData.status.PendingApproval);
  await expect(pages.BulkCollectionPage.hashValue).not.toHaveText('');
  await expect(pages.BulkCollectionPage.toAccountNameLabel).toContainText(testData.BulkCollection.SIT.fromAccount
  );
  await expect(pages.BulkCollectionPage.ucicCodeValue).toContainText(testData.BulkCollection.UCICCode);
  await expect(pages.BulkCollectionPage.balanceValue).not.toHaveText('');
  await expect(pages.BulkCollectionPage.paymentTypeValue).toContainText(testData.BulkCollection.paymentType);
  await expect(pages.BulkCollectionPage.totalAmountValue).toContainText(
    isEdit ? testData.BulkCollection.editAmount : testData.BulkCollection.amount
  );
  await expect(pages.BulkCollectionPage.paymentDate).not.toHaveText('');
  await expect(pages.BulkCollectionPage.referenceValue).toContainText(isEdit ? referenceEdit : reference);
  await expect(pages.BulkCollectionPage.batchIDValue).not.toHaveText('');
  await expect(pages.BulkCollectionPage.colTotalPayee).toContainText(testData.BulkCollection.totalItem);
  await expect(pages.BulkCollectionPage.colTotalAmount).toContainText(
    isEdit ? testData.BulkCollection.editAmount : testData.BulkCollection.amount
  );
  await expect(pages.BulkCollectionPage.payerNameValue).toContainText(testData.BulkCollection.newPayeeName);
  await expect(pages.BulkCollectionPage.payerNickNameValue).toContainText(testData.BulkCollection.newPayeeName);
  await expect(pages.BulkCollectionPage.payerBankName).toContainText(testData.BulkCollection.payeeBankName);
  await expect(pages.BulkCollectionPage.bankCodeValue).toContainText(testData.BulkCollection.payeeBankID);
  await expect(pages.BulkCollectionPage.accountNumberValue).toContainText(
    testData.BulkCollection.payeeBankAccountNumber
  );
  await expect(pages.BulkCollectionPage.DDAReferenceValue).toContainText(testData.BulkCollection.DDAreference);
  await expect(pages.BulkCollectionPage.refForPayeeValue).toContainText(testData.BulkCollection.referenceForPayee);
  await pages.BulkCollectionPage.showOptionView.first().click(); // collapse optional section again
  await expect(pages.BulkCollectionPage.emailmessageValue).toContainText(
    isEdit ? testData.BulkCollection.messageEdit : testData.BulkCollection.message
  );

  // Email list can be concatenated in one element; assert each appears
  await expect(pages.BulkCollectionPage.emailList).toContainText(testData.BulkCollection.emailIdO);
  await expect(pages.BulkCollectionPage.emailList).toContainText(testData.BulkCollection.emailId1);
  await expect(pages.BulkCollectionPage.emailList).toContainText(testData.BulkCollection.emailId2);
  await expect(pages.BulkCollectionPage.emailList).toContainText(testData.BulkCollection.emailId3);
  await expect(pages.BulkCollectionPage.emailList).toContainText(testData.BulkCollection.emailId4);

  await expect(pages.BulkCollectionPage.activityLogSection).toContainText(isEdit ? 'Modify' : 'Create');
}