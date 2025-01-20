import type { Page } from '@playwright/test';

export abstract class PageHolder {
  constructor(protected page: Page) {}
}
export abstract class Component extends PageHolder {
  abstract expectLoaded(message?: string): Promise<void>;
}

export abstract class AppPage extends Component {
  /**
   * Default path to the page. Derived classes can override this.
   */
  public pagePath: string = '/';
  /**
   * Opens the page in the browser and expectLoaded should pass
   */
  async open(path?: string) {
    await this.page.goto(path ?? this.pagePath);
    await this.expectLoaded();
  }
}
