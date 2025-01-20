import { receptionFixture } from './reception.fixture';
import { createServiceRequestViaAPI } from '../utils/api/createServiceRequest';
import { DictionaryEntry } from '../models/dictionary.model';
import { ServiceRequestData } from '../models/serviceRequest.model';

export const serviceRequestFixture = receptionFixture.extend<{
  service: DictionaryEntry;
  serviceRequest: ServiceRequestData;
}>({
  service: undefined, // Placeholder for service options to override during test setup

  serviceRequest: async ({ app, reception, patient, doctor, service, context }, use) => {
    if (!service) {
      throw new Error('Service must be provided.');
    }

    // Use data from the parent receptionFixture and patientFixture
    const { episodeId, encounterId } = reception;
    const { patientId } = patient;

    // Create the appointment via API
    const serviceRequestData = await createServiceRequestViaAPI(
      app,
      patientId,
      encounterId,
      episodeId,
      doctor,
      service,
    );

    //Clear auth cookies
    await context.clearCookies();

    // Pass the appointment data to the test
    await use(serviceRequestData);
  },
});
