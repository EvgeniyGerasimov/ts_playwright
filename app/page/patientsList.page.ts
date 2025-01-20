import { expect } from '@playwright/test';
import { AppPage } from '../abstractClasses';

export class PatientsListPage extends AppPage {
  public pagePath = '/patient/list';

  private patientsSearchHeader = this.page.getByRole('heading', { name: 'Пошук ідентифікованого пацієнта' });

  async expectLoaded(message = 'Expected Patients List page to be opened') {
    await expect(this.patientsSearchHeader, message).toBeVisible();
  }
}
