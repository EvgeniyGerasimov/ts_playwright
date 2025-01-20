import { expect } from '@playwright/test';
import { Component } from '../abstractClasses';

export class SelectMenuDropDown extends Component {
  private selectDropDown = this.page.locator('//div[contains(@class,"Select__menu")]');

  async expectLoaded() {
    await expect(this.selectDropDown, 'search menu drop-down to be visible').toBeVisible();
  }

  async selectMenuDropDown(text: string) {
    await this.selectDropDown.locator('//div').getByText(text).click();
  }
}
