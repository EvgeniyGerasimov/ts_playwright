import { ServiceRequestBuilder } from '../../api/builders/serviceRequest.builder';
import { SignerAppointmentBuilder } from '../../api/builders/signerAppointmet.builder';
import { SignDSBuilder } from '../../api/builders/signDS.builder';
import { expect } from '@playwright/test';
import { Doctor } from '../../models/doctor.model';
import { DictionaryEntry } from '../../models/dictionary.model';
import { Application } from '../../app';

export async function createServiceRequestViaAPI(
  app: Application,
  patientId: string,
  encounterId: string,
  episodeId: string,
  doctor: Doctor,
  service: DictionaryEntry,
) {
  //Get doctor's resource id
  const doctorInfoResponse = await app.api.auth.getUserInfo();
  const resourceId: string = doctorInfoResponse.resourceId;

  // Get eHealthPersonId and eHealthEncounterId
  const patientDetailsResponse: any = await app.api.patient.getPatientById(patientId);
  const eHealthPersonId = patientDetailsResponse.data.ehealthSync.associationKey;
  const encounterResponse: any = await app.api.encounter.getEncounterById(patientId, encounterId);
  const eHealthEncounterId = encounterResponse?.data?.ehealthSync?.associationKey;

  //Get service info from dictionary by service code
  const serviceInfoRequest: any = await app.api.disRestDictionary.getServiceFromDict(resourceId, service.code);
  const achiId = serviceInfoRequest?.[0].id;
  const category = serviceInfoRequest?.[0].category;
  const programId = serviceInfoRequest?.[0].participants?.[0].medical_program_id;

  //Create appointment template and store required Ids
  const appointmentParams = new ServiceRequestBuilder(
    programId,
    category,
    eHealthPersonId,
    episodeId,
    eHealthEncounterId,
    service.name,
    achiId,
  ).build();
  const createAppointmentRequest: any = await app.api.appointment.createAppointment(appointmentParams);
  const appointmentId = createAppointmentRequest.appointment_id;
  const eHealthProgramId = createAppointmentRequest?.view_data?.program_id;
  const eHealthEpisodeId = createAppointmentRequest?.view_data?.episode_id;
  const eHealthLegalEntityId = createAppointmentRequest?.view_data?.legal_entity_id;
  const eHealthEmployeeId = createAppointmentRequest?.view_data?.employee_id;
  const eHealthConditionId = createAppointmentRequest?.view_data?.reason_references?.[0]?.id;

  // Register signer and get signId
  const signerParams = {
    category,
    eHealthEncounterId,
    eHealthEmployeeId,
    eHealthLegalEntityId,
    eHealthConditionId,
    eHealthEpisodeId,
    appointmentId,
    eHealthProgramId,
    achiId,
  };
  const registerSignerParams = new SignerAppointmentBuilder(signerParams).build();
  const registerSinger: any = await app.api.disRestSigner.registerSigner(registerSignerParams);
  const appointmentSignId = registerSinger.body.Id;

  // Sign appointment
  const dsTokenResponse: any = await app.api.depositSign.getDSToken(doctor.depositSignSignature);
  const dsToken = dsTokenResponse.Token;
  await app.api.depositSign.validateDSPassword(doctor.depositSignSignature, dsToken);
  const appointmentSignItem = new SignDSBuilder(doctor.depositSignSignature, dsToken).build();
  await app.api.depositSign.signItem(appointmentSignId, appointmentSignItem);

  // Send appointment
  const sendAppointmentResponse = await app.api.appointment.sendAppointment(appointmentId, appointmentSignId);

  // Get and validate appointment details
  const appointmentDetails: any = await app.api.appointment.getAppointmentDetails(appointmentId);
  const appointmentStatus = appointmentDetails.status;
  const eHealthStatus = appointmentDetails?.ehealth_data.status;
  const requisitionNumber = appointmentDetails?.ehealth_data.requisition;
  expect(appointmentStatus, "expect appointment status to be 'processed'").toBe('processed');
  expect(eHealthStatus, "expect appointment in e-health to be 'active'").toBe('active');

  // return appointment data
  return { appointmentId, requisitionNumber };
}
