import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';
import { AddAchiServiceModal } from '../component/modals/addAchiServiceModal.component';
import { DictionaryEntry } from '../../models/dictionary.model';
import { selectServiceLocation } from '../../utils/helpers';

export class DiagnosticReportPage extends AppPage {
  private addAchiServiceModal = new AddAchiServiceModal(this.page);
  private diagnosticReportHeader = this.page.getByRole('heading', { name: 'Діагностичний звіт' });
  private addProvidedServicesHeader = this.page.getByRole('heading', {
    name: 'Додайте надані послуги (діагностичні звіти, процедури, послуги)',
  });
  private location = this.page.locator('//div[@id="location"]');
  private diagnosticReportIssuedAt = this.page.locator('//input[@id="issuedAt"]');
  private conclusion = this.page.locator('//textarea[@id="conclusion"]');
  private addDRServiceButton = this.addProvidedServicesHeader.locator(
    '//following-sibling::button[contains(@class, "btn-info")]',
  );
  private submitProcedureButton = this.page.getByRole('button', { name: 'Завершити' });

  async addProvidedServices(serviceCode: string, serviceName: string) {
    await this.addDRServiceButton.click();
    await this.addAchiServiceModal.expectLoaded();
    await this.addAchiServiceModal.addService(serviceCode, serviceName);
  }

  async submitDiagnosticReport() {
    this.submitProcedureButton.click();
    //wait for successful procedure creation
    const response = await this.page.waitForResponse(
      (response) => response.url().includes('/diagnosticReports/')
        && response.request().method() === 'PUT',
    );
    expect(
      response.ok(),
      `Create DR request completed with status ${response.status()}: ${response.statusText()}`,
    ).toBe(true);
  }

  async fillInConclusion() {
    await this.conclusion.pressSequentially('Тестове заключення лікаря');
  }

  async expectLoaded(message = 'Expected medical records page to be loaded') {
    await expect(this.diagnosticReportHeader, message).toBeVisible();
    await expect(this.location, message).toBeVisible();
    await expect(this.diagnosticReportIssuedAt, message).toBeVisible();
  }

  async fillInDRDetails(diagnosticReport: DictionaryEntry) {
    await selectServiceLocation(this.page);
    await this.addProvidedServices(diagnosticReport.code, diagnosticReport.name);
    await this.fillInConclusion();
    await this.submitDiagnosticReport();
  }
}
