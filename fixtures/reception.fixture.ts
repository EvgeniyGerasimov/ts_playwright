import { ReceptionFixtureOptions } from '../models/fixtureOptions.model';
import { createReceptionViaAPI } from '../utils/api/createReception';
import { patientFixture } from './patient.fixture';
import { ReceptionData } from '../models/reception.model';

export const receptionFixture = patientFixture.extend<{
  receptionOptions: ReceptionFixtureOptions;
  reception: ReceptionData;
}>({
  receptionOptions: undefined, // Placeholder for receptionOptions to override during test setup

  reception: async ({ app, receptionOptions, patient }, use) => {
    if (!receptionOptions) {
      throw new Error('Reception options must be provided.');
    }

    // Log in
    await app.headlessLogin(receptionOptions.doctor);

    // Create Reception via API
    const receptionData = await createReceptionViaAPI(app, receptionOptions, patient);

    // Pass reception data to the test
    await use(receptionData);
  },
});
