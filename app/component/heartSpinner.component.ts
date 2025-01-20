import { expect } from '@playwright/test';
import { Component } from '../abstractClasses';

export class HeartSpinner extends Component {
  private heartSpinner = this.page.locator('//div[contains(@class,"spiner_heart")]');

  async expectLoaded() {
    await expect(this.heartSpinner).toBeVisible();
  }

  async waitUntilHidden() {
    await this.heartSpinner.first().waitFor({ state: 'hidden' });
  }
}
