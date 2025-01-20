import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';
import { HeartSpinner } from '../component/heartSpinner.component';
import { step } from '../../utils/step';

export class PatientPage extends AppPage {
  public pagePath = `/emk/page/`;

  private heartSpinner = new HeartSpinner(this.page);
  private createReceptionNowBtn = this.page.locator('#addEventNow');
  private createEHealthEventNowBtn = this.page.locator('#createEhealthEventNowButton');
  private yourReceptionsModalHeader = this.page.getByRole('heading', { name: 'Ваші прийоми із пацієнтом' });
  private receptionPageHeader = this.page.getByRole('heading', { name: 'Прийом пацієнта' });
  private proceedWithNewReceptionBtn = this.page.getByRole('button', { name: 'Перейти до створення нового' });

  @step("Validate that patient emk page is loaded")
  async expectLoaded(message = 'Expected Patient page to be opened') {
    await expect(this.createReceptionNowBtn, message).toBeVisible();
  }

  @step("Start reception")
  async startReceptionNow() {
    await this.createReceptionNowBtn.click();
    await this.createEHealthEventNowBtn.click();

    // Wait for one of the elements to be attached and visible
    await Promise.race([
      this.yourReceptionsModalHeader.waitFor({ state: 'visible' }),
      this.receptionPageHeader.waitFor({ state: 'visible' }),
    ]);
      // Check if the modal header is visible
    if (await this.yourReceptionsModalHeader.isVisible()) {
      await this.proceedWithNewReceptionBtn.click();
    }

    await this.heartSpinner.waitUntilHidden();
  }

  @step("Open patient emk page")
  async open(patientId: string) {
    await this.page.goto(`/emk/page/${patientId}`);
    await this.expectLoaded();
  }
}
