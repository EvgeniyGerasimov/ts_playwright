import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';
import { HeartSpinner } from '../component/heartSpinner.component';
import { SignModal } from '../component/modals/signModal.component';
import { FinanceModal } from '../component/modals/financeModal.component';
import { DictionaryEntry } from '../../models/dictionary.model';
import { AntSelector } from '../component/antSelector.component';
import { SearchDropDown } from '../component/searchDropDown.component';
import { SelectMenuDropDown } from '../component/selectMenu.component';
import { delay, selectServiceLocation } from '../../utils/helpers';
import { AddServiceRequestModal } from '../component/modals/addServiceRequestModal.component';
import { CancelReceptionModal } from '../component/modals/cancelReceptionModal.component';
import { ClinicalState, ClinicalStatus } from '../../data/diagnoseParams';
import { step } from '../../utils/step';

export class ReceptionPage extends AppPage {
  //components
  private signModal = new SignModal(this.page);
  private heartSpinner = new HeartSpinner(this.page);
  public financeModal = new FinanceModal(this.page);
  private antSelector = new AntSelector(this.page);
  private searchDropDown = new SearchDropDown(this.page);
  private selectMenuDropDown = new SelectMenuDropDown(this.page);
  private addServiceRequestModal = new AddServiceRequestModal(this.page);
  private cancelReceptionModal = new CancelReceptionModal(this.page);

  //locators
  private generalInfoSection = this.page.getByRole('heading', { name: 'Загальна інформація' });
  private icpcReasonHeader = this.page.getByRole('heading', { name: 'Додайте причини ICPC2' });
  private searchICPC2Reasons = this.page.locator('//input[@id="SearchICPC2Reasons"]');
  private searchICPC2Actions = this.page.locator('//input[@id="SearchICPC2Actions"]');
  private icpcActionHeader = this.page.locator('//h4[normalize-space(text())="Додайте дії ICPC2"]');
  private addIcpc2Header = this.page.getByRole('heading', { name: 'Додайте діагноз ICPC' });
  private addIcd10AmHeader = this.page.getByRole('heading', { name: 'Додайте діагноз МКХ-10 АМ' });
  private addIcpc2DiagnoseButton = this.addIcpc2Header.locator('+ button.btn.btn-info');
  private addIcd10AmModalHeader = this.page.getByText('Додавання діагнозу МКХ-10 АМ');
  private addIcpc2ModalHeader = this.page.getByText('Додавання діагнозу ICPC');
  private addIcd10AmDiagnoseButton = this.addIcd10AmHeader.locator('+ button.btn.btn-info');
  private clinicalStatusSelector = this.page.locator('//div[@id="clinicalStatus"]');
  private icpc2IdInput = this.page.locator('//input[@id="icpc2Id"]');
  private icd10AmIdInput = this.page.locator('//input[@id="icd10AmId"]');
  private serviceInput = this.page.locator(
    '//div[contains(@class, "Select__placeholder") and text()="Почніть вводити назву або код послуги"]/parent::div//input[contains(@class, "Select__input")]',
  );
  private clinicalStateSelector = this.page.locator('//div[@id="verificationStatus"]');
  private modalFooter = this.page.locator('//div[@class="modal__footer"]'); //TODO create component
  private addButton = this.modalFooter.getByRole('button', { name: 'Додати' });
  private createEpisodeButton = this.page.locator('//button[contains(text(),"Створити")]').nth(1);
  private finishButton = this.page.locator('//button[text()="Завершити"]');
  private receptionSyncHeader = this.page.locator('//div[contains(@class,"ReceptionSync__Header")]');
  private receptionSyncTable = this.page.locator('//div[contains(@class,"ReceptionSync__table")]//tbody');
  private syncNowButton = this.receptionSyncHeader.getByRole('button', { name: 'Синхронізувати зараз' });
  private episodeSyncStatus = this.receptionSyncTable.getByText('Епізод').locator('//ancestor::tr//td[3]');
  private receptionSyncStatus = this.receptionSyncTable.getByText('Прийом').locator('//ancestor::tr//td[3]');
  private cancelReceptionSyncStatus = this.receptionSyncTable
    .getByText('Прийом(Позначення помилковості)')
    .locator('//ancestor::tr//td[3]');
  private episodeTypeSelector = this.page
    .locator('//span[contains(text(),"Виберіть тип епізоду")]/../span/input')
    .nth(1);
  private medicalRecordsMenuOption = this.page.locator('//a[@id="link_medicalRecords"]');
  private receptionMenuOption = this.page.locator('//a[@id="link_reception"]');
  private financeHeader = this.page.locator('//div[h4[text()="Пакет медичних послуг для перевірки на відповідність"]]');
  private financeInput = this.financeHeader.locator('//input[@type="search"]');
  private financeActionButton = this.financeHeader.locator('//button[text()="Перевірити"]');
  private appointmentTypeDropDown = this.page.locator(
    '//div[text()="Тип\"]/ancestor::div[contains(@class,"form-group")]//div[contains(@class,"Select__control")]',
  );
  private sendButton = this.page.getByRole('button', { name: 'Надіслати' }).first();
  private addServiceRequestButton = this.page.getByRole('button', { name: 'Додати направлення' });
  private serviceRequestCard = this.page.locator('//div[@class="ServiceRequestsList"]//div[contains(@class, "card")]');
  private cancelReceptionButton = this.page.getByRole('button', { name: 'Позначити помилковим' });


  async selectICPC2Reason(reason: DictionaryEntry) {
    await this.searchICPC2Reasons.pressSequentially(reason.code);
    await this.searchDropDown.selectFromSearchDropDown(reason.name);
    await this.icpcReasonHeader.click();
  }

  async addIcpc2Diagnose(
    diagnose: DictionaryEntry,
    clinicalStatus: ClinicalStatus = ClinicalStatus.ACTIVE ,
    clinicalState: ClinicalState = ClinicalState.FINAL,
  ) {
    await this.addIcpc2DiagnoseButton.click();
    await this.clinicalStatusSelector.click();
    await this.selectMenuDropDown.selectMenuDropDown(clinicalStatus);
    await this.icpc2IdInput.pressSequentially(diagnose.code);
    await this.searchDropDown.selectFromSearchDropDown(diagnose.name);
    await this.clinicalStateSelector.click();
    await this.selectMenuDropDown.selectMenuDropDown(clinicalState);
    await this.addButton.click();
    const response = await this.page.waitForResponse(
      (response) =>
        response.url().includes('/diagnoses') &&
        response.request().method() === 'POST'
    );
    expect(
      response.ok(),
      `Add diagnose request completed with status ${response.status()}: ${response.statusText()}`,
    ).toBe(true);
    await expect(this.addIcpc2ModalHeader, 'Add diagnose modal should be closed successfully').toBeHidden();
  }

  async addIcd10AmDiagnose(
    diagnose: DictionaryEntry,
    clinicalStatus: ClinicalStatus = ClinicalStatus.ACTIVE ,
    clinicalState: ClinicalState = ClinicalState.FINAL,
  ) {
    await this.addIcd10AmDiagnoseButton.click();
    await this.clinicalStatusSelector.click();
    await this.selectMenuDropDown.selectMenuDropDown(clinicalStatus);
    await this.icd10AmIdInput.pressSequentially(diagnose.code);
    await this.searchDropDown.selectFromSearchDropDown(diagnose.name);
    await this.clinicalStateSelector.click();
    await this.selectMenuDropDown.selectMenuDropDown(clinicalState);
    await this.addButton.click();
    const response = await this.page.waitForResponse(
      (response) =>
        response.url().includes('/diagnoses') &&
        response.request().method() === 'POST'
    );
    expect(
      response.ok(),
      `Add diagnose request completed with status ${response.status()}: ${response.statusText()}`,
    ).toBe(true);
    await expect(this.addIcd10AmModalHeader, 'Add diagnose modal should be closed successfully').toBeHidden();
  }

  async selectICPC2Actions(service: DictionaryEntry) {
    await this.searchICPC2Actions.pressSequentially(service.code);
    await this.searchDropDown.selectFromSearchDropDown(service.name);
    await this.heartSpinner.waitUntilHidden();
    await this.icpcActionHeader.click();
  }

  async selectService(service: DictionaryEntry | DictionaryEntry[]) {
    if (Array.isArray(service)) {
      for (const entry of service) {
        await this.serviceInput.pressSequentially(entry.code);
        await this.selectMenuDropDown.selectMenuDropDown(entry.name);
        await this.heartSpinner.waitUntilHidden();
        await this.addIcd10AmHeader.click(); // click to close drop-down
      }
    } else {
      await this.serviceInput.pressSequentially(service.code);
      await this.selectMenuDropDown.selectMenuDropDown(service.name);
      await this.heartSpinner.waitUntilHidden();
      await this.addIcd10AmHeader.click(); // click to close drop-down
    }
  }

  @step("Select appointment type")
  async selectAppointmentType(appointmentType: string) {
    await this.appointmentTypeDropDown.isVisible()
    await this.appointmentTypeDropDown.scrollIntoViewIfNeeded()
    await this.appointmentTypeDropDown.click();
    await this.selectMenuDropDown.selectMenuDropDown(appointmentType);
  }

  async selectEpisodeType(episodeType: string) {
    await this.episodeTypeSelector.click();
    await this.antSelector.chooseFromAntSelector(episodeType);
  }

  async createEpisode() {
    await this.createEpisodeButton.click();
  }

  @step("Validate that reception page is loaded")
  async expectLoaded(message = 'Expected Reception page to be opened') {
    await expect(this.generalInfoSection, message).toBeVisible();
  }

  @step("Sign reception")
  async signReception(fileKey: any) {
    await this.finishButton.click();
    await this.signModal.signWithTheKey(fileKey.keyPath, fileKey.keyPin);
  }

  @step("Sign cancel reception")
  async signCancelReception(fileKey: any) {
    await this.signModal.signWithTheKey(fileKey.keyPath, fileKey.keyPin);
  }

  @step("Sync reception")
  async syncNow() {
    await expect(this.syncNowButton, 'Sync now button to be visible').toBeVisible();
    await this.syncNowButton.scrollIntoViewIfNeeded();
    await this.syncNowButton.click();
  }

  async syncNowWithRetry(maxRetries: number = 5) {
    await this.syncNow();

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      // Wait for the response and click the Sync Now button
      const response = await this.page.waitForResponse(
        (response) =>
          response.url().includes('/syncTasks') &&
          response.request().method() === 'GET' &&
          response.status() === 200,
      );

      const responseBody = await response.json();
      const error = responseBody?.data?.[0].ehealthSync?.error?.errors?.[0];
      // Check if there's an error in the response body
      if (error) {
        // Retry only for specific error message caused by caching issue on the e-health side
        if (error.messages?.[0] === 'Персона не знайдена. Виконайте повторний пошук пацієнта в ЕСОЗ.') {
          if (attempt < maxRetries) {
            await this.sendButton.click(); // send episode to e-health one more time
            await delay(2000);
            continue;
          } else {
            throw new Error('Max sync attempts reached. Sync failed.');
          }
        } else {
          throw new Error(`Unexpected error: ${error.messages?.[0]}`);
        }
      }
      // Break the loop if no error
      break;
    }
  }

  async goToMedicalRecords() {
    await expect(this.medicalRecordsMenuOption, 'Medical records option to be visible').toBeVisible();
    await this.medicalRecordsMenuOption.click();
  }

  async goToReception() {
    await expect(this.receptionMenuOption, 'Reception option to be visible').toBeVisible();
    await this.receptionMenuOption.click();
    await this.expectLoaded();
  }

  @step("Select finance package")
  async selectFinancePackage(financePackage: string) {
    await this.financeInput.scrollIntoViewIfNeeded();
    await this.financeInput.click();
    await this.antSelector.chooseFromAntSelector(financePackage);
    await this.financeActionButton.click();
    await this.financeModal.expectLoaded();
  }

  async verifySyncStatus() {
    await expect(this.episodeSyncStatus, 'check episode sync status').toHaveText('Синхронізовано з ЕСОЗ');
    await expect(this.receptionSyncStatus, 'check reception sync status').toHaveText('Синхронізовано з ЕСОЗ');
  }

  async verifyCancelReceptionSyncStatus() {
    await expect(this.cancelReceptionSyncStatus, 'Reception cancellation should be synchronized').toHaveText(
      'Синхронізовано з ЕСОЗ',
    );
  }

  @step("Fill in ICPC2 reception details")
  async fillInFirstLineReceptionDetails(
    reason: DictionaryEntry,
    icpcDiagnose: DictionaryEntry,
    action: DictionaryEntry,
  ) {
    await this.selectICPC2Reason(reason);
    await this.addIcpc2Diagnose(icpcDiagnose);
    await this.selectICPC2Actions(action);
    await this.createEpisode();
  }

  @step("Fill in icd10Am reception details")
  async fillInSecondLineReceptionDetails(
    reason: DictionaryEntry,
    icd10AmDiagnose: DictionaryEntry,
    receptionService: DictionaryEntry | DictionaryEntry[],
    episodeType: string,
  ) {
    await selectServiceLocation(this.page);
    await this.selectICPC2Reason(reason);
    await this.addIcd10AmDiagnose(icd10AmDiagnose);
    await this.selectService(receptionService);
    await this.selectEpisodeType(episodeType);
    await this.createEpisode();
  }

  async addServiceRequest(requisitionNumber: string, code: string) {
    await this.addServiceRequestButton.click();
    await this.addServiceRequestModal.expectLoaded();
    await this.addServiceRequestModal.selectServiceRequest(requisitionNumber, code);
    await expect(this.serviceRequestCard, 'Service request card to be visible').toBeVisible();
    await expect(this.serviceRequestCard, 'Service request to have correct service code').toContainText(code);
  }

  async openReceptionById(patientId: string, eventId: string) {
    await this.page.goto(`/emk/page/${patientId}/receptionPage/${eventId}/reception`);
    await this.expectLoaded();
  }

  async cancelReception() {
    await this.cancelReceptionButton.click();
    await this.cancelReceptionModal.expectLoaded();
    await this.cancelReceptionModal.fillInCancelReceptionDetails();
    await this.expectLoaded()
  }
}
