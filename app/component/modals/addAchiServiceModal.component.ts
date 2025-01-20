import { expect } from '@playwright/test';
import { Component } from '../../abstractClasses';

export class AddAchiServiceModal extends Component {
  private modalHeader = this.page.locator('//div[(text()="Додати послугу ACHI")]');
  private achiServiceInput = this.page.locator('//div[@id="achi"]//input[@class="Select__input"]');
  private selectMenuDropDown = this.page.locator('//div[contains(@class,"Select__menu")]');
  private createButton = this.page.getByRole('button', { name: 'Створити' });

  async addService(serviceCode: string, serviceName: string) {
    await this.achiServiceInput.click();
    await this.achiServiceInput.pressSequentially(serviceCode);
    await this.selectMenuDropDown.locator('//div').getByText(serviceName).first().click();
    await this.createButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.modalHeader).toBeVisible();
    await expect(this.achiServiceInput).toBeVisible();
  }
}
