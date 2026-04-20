import { SAMLoginPage } from './SAMLoginPage';
import { Page } from 'playwright';

export {
  SAMLoginPage
};

export class NavigatePages {
    public samLoginPage: SAMLoginPage;

  constructor(private readonly page: Page) {  
    this.samLoginPage = new SAMLoginPage(this.page);
  }

  public async loginSAM(userid: string): Promise<void> {
    await this.samLoginPage.loginSAM(userid);
  }
}