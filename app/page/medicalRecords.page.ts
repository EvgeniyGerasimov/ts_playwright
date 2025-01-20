import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';

export class MedicalRecordsPage extends AppPage {
  private diagnosticReportHeader = this.page.locator(
    '//h4[contains(@class, "text-info") and normalize-space(text())="Діагностичні звіти"]',
  );
  private procedureHeader = this.page.locator(
    '//h4[contains(@class, "text-info") and normalize-space(text())="Процедури"]',
  );
  private addProcedureButton = this.procedureHeader.locator(
    '//following-sibling::button[contains(@class, "btn-info")]',
  );
  private addDiagnosticReportButton = this.diagnosticReportHeader.locator(
    '//following-sibling::button[contains(@class, "btn-info")]',
  );
  private tableContent = this.page.locator(`//tbody[contains(@class, 'ant-table-tbody')]//div`)

  async addProcedure() {
    await this.addProcedureButton.click();
  }

  async addDiagnosticReport() {
    await this.addDiagnosticReportButton.click();
  }

  async verifyEntityIsAddedToMedicalRecords(service: string) {
    const textBeforeParenthesis = service.split('(')[0].trim();
    await expect( this.tableContent.getByText(textBeforeParenthesis),
      'Entity should be displayed on the Medical Records page',
    ).toBeVisible();
  }

  async expectLoaded(message = 'Expected medical records page to be loaded') {
    await expect(this.diagnosticReportHeader, message).toBeVisible();
    await expect(this.procedureHeader, message).toBeVisible();
    await expect(this.addProcedureButton, message).toBeVisible();
    await expect(this.addDiagnosticReportButton, message).toBeVisible();
  }
}
