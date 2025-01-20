import { Component } from '../../abstractClasses';
import { expect } from '@playwright/test';

export class EHealthAuthModal extends Component {
  private modalHeader = this.page.getByRole('heading', { name: 'Увага!' });
  public authRequiredMessage = this.page.getByText(
    'Час вашої авторизації на E-health закінчився. Вам необхідно пройти повторну авторизацію.',
  );
  private openEHealthModal = this.page.getByRole('button', { name: 'Авторизуватися' });
  private eHealthPasswordInput = this.page.getByPlaceholder('Пароль');
  private enterButton = this.page.locator('//div[span[text()="Увійти"]]');
  private continueButton = this.page.locator('//div[span[text()="Прийняти та продовжити"]]');

  async loginToEHealth(password: string) {
    await this.openEHealthModal.click();
    await this.eHealthPasswordInput.fill(password);
    await this.enterButton.click();
    await this.continueButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.modalHeader).toBeVisible();
    await expect(this.authRequiredMessage).toBeVisible();
  }
}
