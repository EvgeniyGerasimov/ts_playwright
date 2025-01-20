import { expect } from '@playwright/test';
import { Component } from '../../abstractClasses';
import path from 'node:path';

export class SignModal extends Component {
  private signModal = this.page.locator('//div[@id="eSignReadPrivateKeyModal"]');
  private keyModalBody = this.page.locator('//div[@id="keyModalBody"]');
  private signModalHeader = this.signModal.getByRole('heading', { name: 'Підписання' });
  private pinInput = this.keyModalBody
    .locator('//div[@class="key-container item field-wrapper"]')
    .locator('input[type="password"]');
  private addKeyButton = this.keyModalBody.getByRole('button', { name: 'Додати ключ' });
  private chooseButton = this.keyModalBody.locator('//div[@class="key-container item"]//a[text()="Оберіть"]');
  private signButton = this.keyModalBody.locator(
    '//div[@class="existing-key item"]//button[@class="action-btn storage-sign"]',
  );

  async expectLoaded(): Promise<void> {
    await expect(this.signModalHeader).toBeVisible();
    await expect(this.chooseButton).toBeVisible();
  }

  async signWithTheKey(filePath: string, pinCode: string) {
    const fileChooserPromise = this.page.waitForEvent('filechooser', {
      timeout: 25_000,
    });
    await this.chooseButton.click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles(path.join(__dirname, filePath));
    await this.pinInput.fill(pinCode);
    await this.addKeyButton.click();
    await this.signButton.click();
  }
}
