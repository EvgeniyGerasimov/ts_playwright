import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';
import { AddAchiServiceModal } from '../component/modals/addAchiServiceModal.component';
import { DictionaryEntry } from '../../models/dictionary.model';
import { selectServiceLocation } from '../../utils/helpers';

export class ProcedurePage extends AppPage {
  private addAchiServiceModal = new AddAchiServiceModal(this.page);
  private procedureHeader = this.page.getByRole('heading', { name: 'Процедура' });
  private addProvidedServicesHeader = this.page.getByRole('heading', {
    name: 'Додайте надані послуги (діагностичні звіти, процедури, послуги)',
  });
  private location = this.page.locator("//div[@id='location']");
  private procedureDateType = this.page.locator('//div[@id="_procedureDateType"]');
  private addProcedureServiceButton = this.addProvidedServicesHeader.locator(
    '//following-sibling::button[contains(@class, "btn-info")]',
  );
  private submitProcedureButton = this.page.getByRole('button', { name: 'Завершити' });

  async addProvidedServices(serviceCode: string, serviceName: string) {
    await expect(this.addProcedureServiceButton).toBeVisible();
    await this.addProcedureServiceButton.click();
    await expect(this.addProcedureServiceButton, 'Expected add ACHI service to be added successfully').toBeVisible();
    await this.addAchiServiceModal.expectLoaded();
    await this.addAchiServiceModal.addService(serviceCode, serviceName);
  }

  async submitProcedure() {
    this.submitProcedureButton.click();
    //wait for successful procedure creation
    const response = await this.page.waitForResponse(
      (response) => response.url().includes('/procedures')
        && response.request().method() === 'PUT',
    );
    expect(
      response.ok(),
      `Create procedure request completed with status ${response.status()}: ${response.statusText()}`,
    ).toBe(true);
  }

  async fillInProcedureDetails(procedure: DictionaryEntry) {
    await selectServiceLocation(this.page);
    await this.addProvidedServices(procedure.code, procedure.name);
  }

  async expectLoaded(message = 'Expected medical records page to be loaded') {
    await expect(this.procedureHeader, message).toBeVisible();
    await expect(this.location, message).toBeVisible();
    await expect(this.procedureDateType, message).toBeVisible();
  }
}
