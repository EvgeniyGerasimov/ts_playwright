import { expect } from '@playwright/test';
import { Component } from '../../abstractClasses';
import { financeMessages } from '../../../data/finance/financeMessages';
import { step } from '../../../utils/step';

const successMessage = financeMessages.successMessage;

export class FinanceModal extends Component {
  private financeModal = this.page.locator(
    '//div[contains(@class, "FinMonitoringPackageModal")]//div[@class="modal-content"]',
  );
  private financeModalHeader = this.financeModal.getByText('Перевірка коректності даних на входження в пакет');
  private financeTitle = this.financeModal.getByText('Перевірка обраного пакету');
  private successMessage = this.financeModal.locator('//div[@class="block-message block-message_success"]');
  private infoMessage = this.financeModal.locator('//div[@class="block-message block-message_info"]');
  private warningMessage = this.financeModal.locator('//div[@class="block-message block-message_warning"]');
  private errorMessage = this.financeModal.locator('//div[@class="block-message block-message_error"]');

  @step("Validate success message")
  async validateSuccessMessage() {
    await expect(this.successMessage.getByText(successMessage), 'Success message should be visible').toBeVisible();
  }

  @step("Validate warning message")
  async validateWarningMessage(text: string) {
    await expect(this.warningMessage.getByText(text), 'Warning message should be visible').toBeVisible();
  }

  @step("Validate error message")
  async validateErrorMessage(title: string, text: string) {
    await expect(this.errorMessage.getByText(title), 'Error message title should be visible').toBeVisible();
    await expect(this.errorMessage.getByText(text), 'Error additional text should be visible').toBeVisible();
  }

  @step("Validate info message")
  async validateInfoMessage(text: string) {
    await expect(this.infoMessage.getByText(text), 'Info message should be visible').toBeVisible();
  }

  @step("Validate that message is not displayed")
  async validateMessageIsNotDisplayed(title: string, text: string) {
    await this.expectLoaded();
    await expect(this.financeModal.getByText(title), 'Error message title should not be displayed').toHaveCount(0);
    await expect(this.financeModal.getByText(text), 'Error message text should not be displayed').toHaveCount(0);
  }

  @step("Validate message with dynamic text")
  async validateMessageWithDynamicText(staticPart: string, dynamicPart: string) {
    const element = await this.financeModal.getByText(staticPart);

    const actualContent = await element.innerText();

    const transformedDynamicPart = dynamicPart
      .replace(/\s*\(.*\)\s*$/, '') // Remove the part in parentheses
      .replace(' ', ' - '); // Add " - " between the code and the description
    const expectedText = `${staticPart} ${transformedDynamicPart}`;

    await expect(actualContent, 'Text should match').toBe(expectedText);
  }

  @step("Validate that finance modal is loaded")
  async expectLoaded(): Promise<void> {
    await expect(this.financeModal, 'Finance modal should be visible').toBeVisible();
    await expect(this.financeModalHeader, 'Finance modal header should be visible').toBeVisible();
    await expect(this.financeTitle, 'Finance title should be visible').toBeVisible();
  }
}
