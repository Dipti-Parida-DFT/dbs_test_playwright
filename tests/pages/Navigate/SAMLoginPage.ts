// pages/LoginPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { WebComponents } from '../../lib/webComponents';
import loginCredentials from '../../data/loginCredentials.json';

type LoginUrls = {
  baseUrl?: string;      // for CB/SAM default entry
  idealxUrl?: string;    // for IDEALX login
  newSamUrl?: string;    // for new SAM flow
  ssmUrl?: string;       // for SSM flow
};

const isSIT = (process.env.ENV?.toUpperCase() === 'SIT');

export class SAMLoginPage {
  constructor(private readonly page: Page) {
    // --- Common login fields ---
    this.organisationIdInput = page.locator('xpath=//*[@id="OID"]');
    this.userIdInput = page.locator('xpath=//*[@id="UID"]');
    this.passwordInput = page.locator('xpath=//*[@id="password"]');
    this.securityAccessCodeInput = page.locator('xpath=//*[@id="sac"]');
    this.languageSelect = page.locator('xpath=//*[@id="lang"]');
    this.vietnameseOption = page.locator('xpath=//*[@value="vi_vn"]');

    // SSM
    this.ssmOrganisationIdInput = page.locator('xpath=//*[@id="corpId"]');
    this.ssmUserIdInput = page.locator('xpath=//*[@id="username"]');

    // IDEALX (SIT / UAT shared)
    this.idealxOrgIdInput = page.locator('xpath=//*[@id="corpId"] | //*[@id="OID"]'); // support both ids
    this.idealxUserIdInput = page.locator('xpath=//*[@id="username"] | //*[@id="UID"]');
    this.idealxPinInput = page.locator('xpath=//*[@name="psw"] | //*[@id="PIN"]');

    // Top menus / post-login
    this.paymentMenu = page.locator('xpath=//*[@id="nav-item-navBBTopPaymentsLinkText"]');
    this.companyMenu = page.locator('xpath=//*[@class="header-company__name"]');

    // Digi popup (post-login MFA)
    this.digiTokenButton = page.locator('xpath=//*[@id="mat-dialog-0"]/dbs-mars-auth-dialog/div/div[2]/div[2]/button');
    this.digiEnterCodeInput = page.locator('xpath=//*[@id="mat-dialog-0"]/dbs-mars-auth-dialog/div/div[2]/ShuRu');
    this.authNowBar = page.locator('xpath=//div[@class="mat-dialog-actions"]'); // container if needed

    // IE SSL (not needed in Playwright, kept in case you still show similar elements)
    this.moreInfoLink = page.locator('xpath=//*[@id="moreInfoContainer"]/a');
    this.overrideLink = page.locator('xpath=//*[@id="overridelink"]');

    // Submit buttons
    this.cbSubmitButton = page.locator('xpath=//*[@name="submit_sbuserLogin"]');
    this.samSubmitButton = page.locator('xpath=//*[@name="submit_csrLogin"]');
    this.ssmSubmitButton = page.locator('xpath=//*[@id="id01"]/div/button');
    this.idealxSubmitButton = page.locator('xpath=//*[@type="submit"]');

    // CN acknowledgement flow
    this.cnCheckbox0 = page.locator('xpath=//*[@id="checkbox_0"]');
    this.cnCheckbox1 = page.locator('xpath=//*[@id="checkbox_1"]');
    this.cnAcknowledgeButton = page.locator('xpath=//*[@class="btn btn__primary"]');

    // UAT special flow
    this.loginWithOrgIdButton = page.locator('xpath=//login-pin/div/div[4]/div/login-form/div[1]/div[2]/button[1]');
    this.uatOrgIdInput = page.locator('xpath=//*[@id="OID"] | //*[@id="corpId"]');
    this.uatUserIdInput = page.locator('xpath=//*[@id="UID"] | //*[@id="username"]');
    this.uatPinInput = page.locator('xpath=//*[@id="PIN"] | //*[@name="psw"]');
    this.uatSacInput = page.locator('xpath=//*[@id="SAC"] | //*[@id="sac"]');
    this.enterCodeLink = page.locator('xpath=//*[@class="link-primary link-underline-opacity-0"]');
    this.enterCodeConfirmButton = page.locator('xpath=//swipe-prompt-modal/div[2]/div/button[1]');
    this.authenticateNowButton = page.locator('xpath=//*[@class="btn btn-lg btn-primary modal-button"]');

    //SAM Locators
    this.samUserIDInput = page.locator('xpath=//*[@id="UID"]');
    this.samPwdInput = page.locator('xpath=//*[@id="password"]');
    this.samSecurityAccessCodeInput = page.locator('xpath=//*[@id="sac"]');
    this.samLoginButton = page.locator('xpath=//*[@name="submit_csrLogin"]');
    this.SAMLogoutButton = page.locator('xpath=//a[@title="Logout and Exit this system"]');
    //this.SAMPostLoginIndicator = page.locator('xpath=//a[text()="HOME" and @href="/samweb/csr/home"]');
    this.SAMPostLoginIndicator = page.locator('xpath=//td[@class="headline" and normalize-space()="Application Manager"]');
    //this.authenticate = page.locator('//button[@type="button" and @class="btn btn__primary"]');

    
  }

  // ---------- Locators ----------
  readonly organisationIdInput: Locator;
  readonly userIdInput: Locator;
  readonly passwordInput: Locator;
  readonly securityAccessCodeInput: Locator;
  readonly languageSelect: Locator;
  readonly vietnameseOption: Locator;

  readonly ssmOrganisationIdInput: Locator;
  readonly ssmUserIdInput: Locator;

  readonly idealxOrgIdInput: Locator;
  readonly idealxUserIdInput: Locator;
  readonly idealxPinInput: Locator;

  readonly paymentMenu: Locator;
  readonly companyMenu: Locator;

  readonly digiTokenButton: Locator;
  readonly digiEnterCodeInput: Locator;
  readonly authNowBar: Locator;

  readonly moreInfoLink: Locator;
  readonly overrideLink: Locator;

  readonly cbSubmitButton: Locator;
  readonly samSubmitButton: Locator;
  readonly ssmSubmitButton: Locator;
  readonly idealxSubmitButton: Locator;

  readonly cnCheckbox0: Locator;
  readonly cnCheckbox1: Locator;
  readonly cnAcknowledgeButton: Locator;

  readonly loginWithOrgIdButton: Locator;
  readonly uatOrgIdInput: Locator;
  readonly uatUserIdInput: Locator;
  readonly uatPinInput: Locator;
  readonly uatSacInput: Locator;
  readonly enterCodeLink: Locator;
  readonly enterCodeConfirmButton: Locator;
  readonly authenticateNowButton: Locator;

    //SAM Locators
    readonly samUserIDInput: Locator;
    readonly samPwdInput: Locator;
    readonly samSecurityAccessCodeInput: Locator;
    readonly samLoginButton: Locator;
    readonly IdealxLogoutButton: Locator;
    readonly SAMLogoutButton: Locator;
    readonly IdealxDashboardLink: Locator;
    readonly SAMPostLoginIndicator: Locator;

  // ---------- Shared waits / helpers ----------


  async gotoSAM() {
     await this.page.goto(
       'https://10.8.59.68:8443/samweb/csr/loginSSO')
   }
   
   async loginSAM(samUserID?: string) {
     const webComponents = new WebComponents();
     const defaultCreds = loginCredentials["SAM"];
     const creds = {
       samUserID: samUserID ?? defaultCreds.samUserID,
       samPWD: defaultCreds.samPWD,
       samSAC: defaultCreds.samSAC
     };
   
     await webComponents.enterText(this.samUserIDInput, creds.samUserID);
     await webComponents.enterText(this.samPwdInput, creds.samPWD);
     await webComponents.enterText(this.samSecurityAccessCodeInput, creds.samSAC);
     await this.samLoginButton.click();
     await webComponents.waitSAMHomePageToBeVisible(this.SAMPostLoginIndicator);
   }
 
}