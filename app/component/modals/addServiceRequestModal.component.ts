import { Component } from '../../abstractClasses';
import { expect } from '@playwright/test';

export class AddServiceRequestModal extends Component {
  private modal = this.page.locator('//div[@class="modal__content"]');
  private modalHeader = this.modal.locator('//div[text()="Додавання направлення"]');
  private serviceRequestType = this.modal.getByText('Тип направлення');
  private serviceRequestInput = this.modal.getByPlaceholder('ХХХХ-ХХХХ-ХХХХ-ХХХХ');
  private searchButton = this.modal.getByRole('button', { name: 'Шукати' });
  private selectServiceRequestHeader = this.modal.getByRole('heading', {
    name: 'Оберіть одне направлення з групи направлень',
  });
  private serviceRequestCard = this.modal.locator('//button[contains(@class, "ServiceRequestCard")]');
  private modalFooter = this.page.locator('//div[contains(@class, "modal__footer")]'); // TODO move to component
  private addButton = this.modalFooter.locator('//button[contains(text(),"Додати")]');

  async selectServiceRequest(requisitionNumber: string, code: string): Promise<void> {
    await this.serviceRequestInput.click();
    await this.serviceRequestInput.fill(requisitionNumber);
    await this.searchButton.click();
    await this.selectServiceRequestHeader.isVisible();
    await this.serviceRequestCard.filter({ hasText: code }).click();
    await this.addButton.click();
  }

  async expectLoaded(): Promise<void> {
    await expect(this.modalHeader, 'Add service request modal should be displayed').toBeVisible();
    await expect(this.serviceRequestType, 'Add service request modal should be displayed').toBeVisible();
  }
}
