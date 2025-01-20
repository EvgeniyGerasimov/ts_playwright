import { Component } from '../../abstractClasses';
import { expect } from '@playwright/test';
import { SelectMenuDropDown } from '../selectMenu.component';

export class CancelReceptionModal extends Component {
  private selectDropDown = new SelectMenuDropDown(this.page);

  private modal = this.page.locator('//div[@class="modal__content"]');
  private modalHeader = this.modal.locator('//div[text()="Позначення прийому помилковим"]');
  private cancelReason = this.modal.locator('#cancelationReasonId');
  private cancelConclusion = this.modal.getByLabel('Заключення*');
  private submitCancelButton = this.modal.getByRole('button', { name: 'Позначити помилковим' });

  async expectLoaded() {
    await expect(this.modalHeader, 'Cancel reception modal should be displayed').toBeVisible();
    await expect(this.modalHeader, 'Cancel reception header should be displayed').toBeVisible();
  }

  async fillInCancelReceptionDetails(text = 'Механічна помилка') {
    await this.cancelReason.click();
    await this.selectDropDown.selectMenuDropDown(text);
    await this.cancelConclusion.fill('Механічна помилка');
    await this.submitCancelButton.click();
    const response = await this.page.waitForResponse(
      (response) => response.url().includes('/cancel') && response.request().method() === 'PATCH',
    );
    await expect(response.status(), 'Cancel reception request should be completed successfully ').toBe(200);
    await expect(this.modalHeader, 'Cancel reception modal should be closed successfully').toBeHidden();
  }
}
