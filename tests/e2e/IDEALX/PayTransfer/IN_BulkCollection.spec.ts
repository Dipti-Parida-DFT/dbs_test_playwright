// tests/IN_BulkCollection.spec.ts
import { test, expect, Page } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';

import { NavigatePages, PaymentsPages } from '../../../pages/IDEALX/index';
import { LoginPage } from '../../../pages/IDEALX/LoginPage';


// --- Load JSON test data ---
const testDataPath = path.resolve(__dirname, '../../../data/IN_testData.json');
const  testData  = JSON.parse(fs.readFileSync(testDataPath, 'utf-8'));
import { chromium, Browser } from 'playwright';

let customBrowser: Browser;


const loginCompanyId = testData.BulkCollection.SIT.loginCompanyId;
const loginUserId    = testData.BulkCollection.SIT.loginUserId;
const fromAccount    = testData.BulkCollection.SIT.fromAccount;
const payeeBankID    = testData.BulkCollection.payeeBankID;

test.describe.serial('IN_Bulk Collection', () => {
  let pages: PaymentsPages;
  // this from OnlineCreate, then Reject/Edit/Delete
  let reference = "";
  let referenceEdit='';
  // Track created payees per test
  type CreatedPayee = { name?: string; accountNumber?: string };
  let createdPayees: CreatedPayee[] = [];

  test.beforeEach(async ({ page }, testInfo) => {
    // This is used by the logging proxies in some converted classes (optional)
    process.env.currentTestTitle = testInfo.title;
    customBrowser = await chromium.launch({ headless: false });
    test.setTimeout(200_000);
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(loginCompanyId, loginUserId, '123');
    await loginPage.handleAnnouncementIfPresent();
    // 2) Create the aggregator once per test
    pages = new PaymentsPages(page);
  });

  test.afterEach(async ({}, testInfo) => {
  // Only cleanup if the test passed
  if (testInfo.status !== 'passed') {
    console.warn(`[cleanup] Skipping payee deletion because test status is ${testInfo.status}`);
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

  test('Create a Bulk collection with new Payee', async ({page}, testInfo) => {
      
    //Navigate to Payments menu
    await pages.AccountTransferPage.waitForMenu();
    await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    
    //Authentication Pop-up
    await pages.AccountTransferPage.handleAuthIfPresent("1111")

    await pages.BulkCollectionPage.safeClick(pages.BulkCollectionPage.bulkCollection);
    await pages.BulkCollectionPage.waitForBulkCollectionFormReady();

     // From account (type + Enter, works for most typeahead controls)
     await pages.BulkCollectionPage.safeClick(pages.BulkCollectionPage.fromAccount);
     await page.keyboard.type(fromAccount);
     await page.keyboard.press('ArrowDown');
     await page.keyboard.press('Enter');
     
    // UCIC
    await pages.BulkCollectionPage.ucicCode.fill(testData.BulkCollection.UCICCode);

    // Reusable helper for add new payee
    const { name, accountNumber }  = await pages.BulkCollectionPage.addNewPayee({
        name: testData.BulkCollection.newPayeeName,
        DDAReferenceNo: testData.BulkCollection.DDAreference,
        bankId: payeeBankID,
        accountNumber: testData.BulkCollection.payeeBankAccountNumber,
        MandateID: testData.BulkCollection.MandateID,
        });

    // Register for cleanup
    createdPayees.push({ name, accountNumber });

    // Amount & reference
    await pages.BulkCollectionPage.amount.fill(testData.BulkCollection.amount);
    await pages.BulkCollectionPage.payeeRef.fill(testData.BulkCollection.referenceForPayee);

    // Optional details
    await pages.BulkCollectionPage.showOptionDetailPayee1.click();
    await pages.BulkCollectionPage.messageToPayer.click();
    await pages.BulkCollectionPage.emailId0.fill(testData.BulkCollection.emailIdO);
    await pages.BulkCollectionPage.emailId1.fill(testData.BulkCollection.emailId1);
    await pages.BulkCollectionPage.emailId2.fill(testData.BulkCollection.emailId2);
    await pages.BulkCollectionPage.emailId3.fill(testData.BulkCollection.emailId3);
    await pages.BulkCollectionPage.emailId4.fill(testData.BulkCollection.emailId4);
    await pages.BulkCollectionPage.message.fill(testData.BulkCollection.message);

    // Next → Preview → Submit
    await pages.BulkCollectionPage.nextButton.click();
    await pages.BulkCollectionPage.waitForPreviewPageReady();
    await pages.BulkCollectionPage.submitButton.click();
    await pages.BulkCollectionPage.waitForSubmittedPageReady();

    // If you just want the full banner text:
    const referenceText = await pages.BulkCollectionPage.getReferenceText();
    console.log('Captured reference text:', referenceText);
    // If you want only the EBLV… token:
    reference = await pages.BulkCollectionPage.getReferenceID();
    console.log('Captured referenceID:', reference);

    //Click on finished button
    await pages.BulkCollectionPage.finishButton.click();   

    // Find it again in Transfer Center by reference
    await pages.TransferCentersPage.searchAndOpenByReference(reference);
    await pages.BulkCollectionPage.waitForViewPaymentPageReady();

    // Validate fields on view page (added for IDXP-812)
    await checkViewPageAllField({
      page,
      pages,
      testData,
      isEdit: false,
      reference,
      referenceEdit: ''
    });
  });

  test('Edit a Bulk Collection via Transfer Center', async ({page}, testInfo) => {
       
     // Navigate to Payments menu
     await pages.AccountTransferPage.waitForMenu();
     await pages.AccountTransferPage.safeClick(pages.AccountTransferPage.paymentMenu);
    
     //Authentication Pop-up
     await pages.AccountTransferPage.handleAuthIfPresent("1111")
    
     console.log('Reference for edit test:', reference);
    // Open the view by reference (or search)
    if (reference.trim().length > 0) {
      console.log('Opening by reference:', reference);
      await pages.TransferCentersPage.searchAndOpenByReference(reference);
    } else {
      await pages.TransferCentersPage.openViewPaymentViaSearch(
        'IN - Bulk Collection',
        testData.status.PendingApproval
      );
    }

    await pages.BulkCollectionPage.waitForViewPaymentPageReady();

    // Edit flow
    await pages.BulkCollectionPage.editButton.click();
    await pages.BulkCollectionPage.waitForBulkCollectionFormReady();
    await pages.BulkCollectionPage.amount.fill(testData.BulkCollection.editAmount);
    await pages.BulkCollectionPage.showOptionDetailPayee1.click();
    await pages.BulkCollectionPage.message.fill(testData.BulkCollection.messageEdit);

    // Next → Preview → Submit
    await pages.BulkCollectionPage.nextButton.click();
    await pages.BulkCollectionPage.waitForPreviewPageReady();
    await pages.BulkCollectionPage.submitButton.click();
    await pages.BulkCollectionPage.waitForSubmittedPageReady();

    // New reference if changed
    const rawText = (await pages.BulkCollectionPage.getReferenceText()) ?? '';
    console.log('Edited Reference:', rawText);
      // If you want only the EBLV… token:
    referenceEdit = await pages.BulkCollectionPage.getReferenceID();
    console.log('Edited referenceID:', referenceEdit);
  
      //Click on finished button
      await pages.BulkCollectionPage.finishButton.click();  

    // Reopen view page
    await pages.AccountTransferPage.paymentMenu.click();
    await pages.TransferCentersPage.searchAndOpenByReference(referenceEdit);
    await pages.BulkCollectionPage.waitForViewPaymentPageReady();

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
      // At least verify amount is present
      await expect(pages.BulkCollectionPage.amountValue).not.toHaveText('');
    }
  });
});

/**
 * Converted from `checkViewPageAllField(isEdit=false)`
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