import { expect } from '@playwright/test';
import { SignDSBuilder } from '../../api/builders/signDS.builder';
import { CreateEpisodeBuilder } from '../../api/builders/createEpisode.builder';
import { EventPeriodBuilder } from '../../api/builders/eventPeriod.builder';
import { AddDiagnoseBuilder } from '../../api/builders/addDiagnose.builder';
import { EventBuilder } from '../../api/builders/event.builder';
import { PatientFixtureOptions, ReceptionFixtureOptions } from '../../models/fixtureOptions.model';
import { Application } from '../../app';
import { delay } from '../helpers';

export async function createReceptionViaAPI(
  app: Application,
  receptionOptions: ReceptionFixtureOptions,
  patientOptions: PatientFixtureOptions,
) {
  //Get doctor's resource id
  const doctorInfoResponse = await app.api.auth.getUserInfo();
  const resourceId: string = doctorInfoResponse.resourceId;

  const { doctor, reason, diagnose, actionOrService, encounterClass, episodeType } = receptionOptions;
  const { patientId, firstName, lastName, birthDate, middleName } = patientOptions;

  // Get location ID
  const locationId = (await app.api.dictionary.getAmbulatoryServiceLocations())?.data?.[0]?.id ?? '';

  // Create event
  const createEventParams = new EventBuilder(patientId, resourceId, locationId)
    .setEncounterClass(encounterClass)
    .build();
  const createEventResponse: any = await app.api.event.createEvent(createEventParams);
  const eventId: string = createEventResponse?.eventId;
  const encounterId: string = createEventResponse?.encounters[0].id;

  // Add ICPC2 reasons and actions
  const reasonId = (await app.api.dictionary.getReasonByName(reason.code))?.data?.[0]?.id ?? '';
  const icpc2ReasonParams = { icpc2Id: reasonId, text: '' };
  await app.api.event.addIcpc2ReasonToEvent(eventId, encounterId, icpc2ReasonParams);

  //first line reception logic
  if (encounterClass === 'PHC') {
    // Add ICPC2 actions
    const actionId = (await app.api.dictionary.getActionByName(actionOrService.code))?.data?.[0]?.id ?? '';
    const icpc2ActionParams = { icpc2Id: actionId, text: '' };
    await app.api.event.addIcpc2ActionToEvent(eventId, encounterId, icpc2ActionParams);
    // Add icpc2 diagnoses
    const icpc2DiagnoseId = (await app.api.dictionary.getIcpc2DiagnoseByName(diagnose.code))?.data?.[0]?.id ?? '';
    const diagnoseParams = new AddDiagnoseBuilder().icpc2Id(icpc2DiagnoseId).build();
    await app.api.event.addDiagnosesToEvent(eventId, encounterId, diagnoseParams);
  }

  //second line reception logic
  if (encounterClass === 'AMB') {
    //Add achiId service
    const serviceActionResponse = await app.api.disRestDictionary.getServiceFromDict(resourceId, actionOrService.code);
    const serviceActionId = serviceActionResponse[0].id;
    const serviceParams = { achiId: serviceActionId, text: '' };
    await app.api.event.addServiceToEvent(eventId, encounterId, serviceParams);

    //Add icd10 diagnoses
    const icd10DiagnoseResponse = await app.api.dictionary.getIcd10amDiagnoseByName(diagnose.code);
    const icd10DiagnoseId: string = icd10DiagnoseResponse?.data?.[0]?.id;
    const icd10DiagnoseParams = new AddDiagnoseBuilder().icd10Am(icd10DiagnoseId).build();
    await app.api.event.addDiagnosesToEvent(eventId, encounterId, icd10DiagnoseParams);
  }

  // Set event period
  const eventPeriodParams = new EventPeriodBuilder().build();
  await app.api.event.setEventPeriod(eventId, encounterId, eventPeriodParams);

  // Create episode
  const episodeParams = new CreateEpisodeBuilder(diagnose.name, episodeType).build();
  await app.api.event.createEpisode(eventId, encounterId, episodeParams);

  // Get sign ID
  const signIdResponse: any = await app.api.event.getEventSignId(eventId);
  const signId = signIdResponse.data.signId;

  // Sign the event
  const depositSignTokenResponse: any = await app.api.depositSign.getDSToken(doctor.depositSignSignature);
  const token = depositSignTokenResponse.Token;
  await app.api.depositSign.validateDSPassword(doctor.depositSignSignature, token);
  const signItem = new SignDSBuilder(doctor.depositSignSignature, token).build();
  await app.api.depositSign.signItem(signId, signItem);
  const signEventResponse: any = await app.api.event.signEvent(eventId, signId);
  expect(signEventResponse.data.eventState, 'expect event state to be FINISHED').toBe('FINISHED');

  // Get event sync tasks
  const syncTaskResponse: any = await app.api.event.getEventSyncTasks(eventId);
  const syncTaskId = syncTaskResponse.data[0].id;

  // Sync reception
  await app.api.event.syncEvent(eventId, syncTaskId);

  // Ensure synchronization
  const maxRetries = 20;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    await delay(4000); // Wait for 4 seconds before each retry

    // Fetch the sync status and extract statuses and error message
    const syncStatusResponse: any = await app.api.event.getEventSyncTasks(eventId);
    const episodeSyncTaskStatus = syncStatusResponse?.data?.[0]?.ehealthSync?.status;
    const eventSyncTaskStatus = syncStatusResponse?.data?.[1]?.ehealthSync?.status;
    const episodeError = syncStatusResponse?.data?.[0]?.ehealthSync?.error?.errors?.[0];
    const eventError = syncStatusResponse?.data?.[1]?.ehealthSync?.error?.errors?.[0];

    // Handle "Failed" status for episode sync
    if (episodeSyncTaskStatus === 'Failed') {
      const errorMessage = episodeError?.messages?.[0];

      // Retry synchronization only for specific error message caused by caching issue on the e-health side
      if (errorMessage === 'Персона не знайдена. Виконайте повторний пошук пацієнта в ЕСОЗ.') {
        if (attempt < maxRetries) {
          //search patient in e-health
          await app.api.patient.searchPatientInEHealth(firstName, lastName, birthDate);

          await app.api.event.syncEvent(eventId, syncTaskId); // Retry synchronization
          continue; // Retry the loop
        } else {
          throw new Error('Max sync attempts reached. Sync failed.');
        }
      } else {
        throw new Error(`Episode synchronization failed with error: ${errorMessage}`);
      }
    }

    if (eventSyncTaskStatus === 'Failed') {
      throw new Error(`Event synchronization failed with error: ${eventError?.messages?.[0]}`);
    }

    // Exit the loop in case of successful synchronization
    if (episodeSyncTaskStatus === 'Synchronized' && eventSyncTaskStatus === 'Synchronized') {
      break;
    }

    // Fail if max attempts reached
    if (attempt === maxRetries) {
      throw new Error(
        `Max sync attempts reached.Episode Sync Status: ${episodeSyncTaskStatus}, Event Sync Status: ${eventSyncTaskStatus}`,
      );
    }
  }

  //Get Episode Id
  const eventResponse = await app.api.event.getEventById(eventId);
  const episodeId = eventResponse.encounters?.[0]?.episodeId;

  return { eventId, encounterId, episodeId };
}
