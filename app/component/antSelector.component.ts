import { expect } from '@playwright/test';
import { Component } from '../abstractClasses';

export class AntSelector extends Component {
  private antSelector = this.page.locator('//div[contains(@class, "ant-select")]');
  private select = this.page.locator('#rc_select_1');
  //private dropdownOptions = this.antSelector.locator('.ant-select-item');
  private scrollContainer = this.antSelector.locator('.rc-virtual-list-holder');

  async expectLoaded() {
    await expect(this.antSelector, 'ant selector to be visible').toBeVisible();
  }


  async chooseFromAntSelector(title: string) {
    const option = this.antSelector.getByText(title);

    await this.page.waitForTimeout(300); // Wait for DOM to update/render new items

    await option.first().isVisible(); // Wait for first option to be visible

    // Check if the desired option is visible initially
    if (await option.isVisible()) {
      await option.click();
      return;
    }

    let found = false;

    for (let i = 0; i < 30; i++) {
      const option = this.antSelector.getByText(title);

      // Check if the desired option is in the DOM and visible
      if ((await option.count()) > 0 && (await option.first().isVisible())) {
        await option.first().click();
        found = true;
        break;
      }

      // Scroll the dropdown container
      await this.scrollContainer.evaluate((container) => container.scrollBy(0, 200));
      await this.page.waitForTimeout(300); // Wait for DOM to update/render new items
    }

    if (!found) {
      throw new Error(`Option with title "${title}" not found in the dropdown.`);
    }
  }
}
