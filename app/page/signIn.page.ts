import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';

export class SignInPage extends AppPage {
  private emailInput = this.page.locator('#email');
  private passwordInput = this.page.locator('#usercreds');
  private submitButton = this.page.locator('input[value="Увійти"]');

  async expectLoaded() {
    await expect(this.submitButton).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
  }

  async signIn(user: { email: string; password: string }) {
    await this.expectLoaded();
    await this.emailInput.fill(user.email);
    await this.passwordInput.fill(user.password);
    await this.submitButton.click();
  }
}
