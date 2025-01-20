import { expect } from '@playwright/test';
import { Component } from '../abstractClasses';

export class SearchDropDown extends Component {
  private searchDropDown = this.page.locator('//div[@class="search__dropDown"]'); // create component

  async expectLoaded() {
    await expect(this.searchDropDown, 'search drop-down to be visible').toBeVisible();
  }

  async selectFromSearchDropDown(text: string) {
    await this.searchDropDown.locator('//div').getByText(text).click();
  }
}
