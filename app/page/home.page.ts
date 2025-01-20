import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';
import { EHealthAuthModal } from '../component/modals/eHealthAuthModal.component';
import { step } from '../../utils/step';

export class HomePage extends AppPage {
  public pagePath = '/';
  private patientCard = this.page.getByRole('link', { name: 'Пацієнти' });
  private eHealthAuthModal = new EHealthAuthModal(this.page);

  @step("Validate that home page is loaded")
  async expectLoaded(message = 'Expected Home page to be opened') {
    await expect(this.patientCard, message).toBeVisible();
  }

  @step("Handle e-health auth")
  async loginToEHealthIfNeeded(password: string) {
    if (await this.eHealthAuthModal.authRequiredMessage.isVisible()) {
      await this.eHealthAuthModal.loginToEHealth(password);
      await this.expectLoaded();
    }
  }

  @step("Open home page")
  async openHomePage(password: string) {
    await this.open(this.pagePath);
    await this.expectLoaded();
    await this.loginToEHealthIfNeeded(password);
  }
}
