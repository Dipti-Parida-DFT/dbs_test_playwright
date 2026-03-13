import { setWorldConstructor } from '@cucumber/cucumber';

// A minimal custom World to share Playwright objects between steps
export class CustomWorld {
  browser: any;
  context: any;
  page: any;
  constructor() {
    this.browser = undefined;
    this.context = undefined;
    this.page = undefined;
  }
}

setWorldConstructor(CustomWorld);
