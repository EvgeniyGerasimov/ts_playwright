import { CreatePatientBuilder } from '../../api/builders/createPatient.builder';
import { PersonalDetailsBuilder } from '../../api/builders/personalDetails.builder';
import { PhoneInfoParamsBuilder } from '../../api/builders/phoneInfoParams.builder';
import { IdentityDocumentsBuilder } from '../../api/builders/identityDocuments.builder';
import { AddAddressBuilder } from '../../api/builders/addAddress.builder';
import { AddEmergencyContactBuilder } from '../../api/builders/addEmergencyContact.builder';
import { DocumentsFormDataBuilder } from '../../api/builders/documentsFormData.builder';
import { SignDSBuilder } from '../../api/builders/signDS.builder';
import { expect } from '@playwright/test';
import { Doctor } from '../../models/doctor.model';
import { delay } from '../helpers';
import { Application } from '../../app';
import fs from 'node:fs';
import path from 'node:path';
import { PatientData } from '../../models/paitent.model';

export async function createPatientViaAPI(app: Application, doctor: Doctor, patientData: PatientData): Promise<any> {
  const fileName = 'passport.png';
  const filePath = path.resolve(__dirname, '../../resources/passport.png');
  const file = fs.readFileSync(filePath);

  const { firstName, lastName, birthDate, middleName } = patientData;

  // Create patient
  const createPatientParams = new CreatePatientBuilder(patientData).build();
  const createPatientResponse = await app.api.patient.createPatient(createPatientParams);
  const patientId = createPatientResponse.data.patientId;

  // Fill in personal details
  const personalDetails = new PersonalDetailsBuilder(patientId, patientData).build();
  await app.api.patient.fillInPatientDetails(patientId, personalDetails);

  // Edit Phone Info
  const phoneInfoParams = new PhoneInfoParamsBuilder().build();
  await app.api.patient.addPhoneInfo(patientId, phoneInfoParams);

  // Set Up authentication methods
  await app.api.patient.setupAuthMethods(patientId, { type: 'OFFLINE' });

  // Add identity documents
  const identityDocuments = new IdentityDocumentsBuilder().build();
  const identityDocumentResponse: any = await app.api.patient.addIdentityDocuments(patientId, identityDocuments);
  const identityDocumentId = identityDocumentResponse.data.identityDocumentId;

  // Verify documents
  await app.api.patient.verifyDocuments(patientId, {
    identityDocumentId: identityDocumentId,
  });

  // Add addresses
  const addressParams = new AddAddressBuilder().build();
  await app.api.patient.addAddress(patientId, addressParams);

  // Add emergency contact
  const emergencyContact = new AddEmergencyContactBuilder().build();
  await app.api.patient.addEmergencyContact(patientId, emergencyContact);

  // Get secret questions
  const secretQuestionResponse: any = await app.api.dictionary.getSecretQuestions();
  const secretQuestionName = secretQuestionResponse[0].name;

  // Add secret question
  const secretQuestionParams = {
    question: secretQuestionName,
    answer: 'qwe12345',
  };
  await app.api.patient.addSecretQuestion(patientId, secretQuestionParams);

  // Create person request
  const personRequestResponse: any = await app.api.patient.createPersonRequest(patientId);
  const personRequestId = personRequestResponse.data.id;
  const multipartFormData = new DocumentsFormDataBuilder(file, fileName).build();
  await app.api.patient.addDocumentsToPersonRequest(patientId, personRequestId, multipartFormData);

  // Approve Person Request
  await app.api.patient.approvePersonRequest(patientId, personRequestId);

  // Get Sign Id
  const signIdResponse = await app.api.patient.getSignId(patientId, personRequestId);
  const signId = signIdResponse.data.signId;

  // Sign
  const depositSignTokenResponse: any = await app.api.depositSign.getDSToken(doctor.depositSignSignature);
  const token = depositSignTokenResponse.Token;
  await app.api.depositSign.validateDSPassword(doctor.depositSignSignature, token);
  const signItem = new SignDSBuilder(doctor.depositSignSignature, token).build();
  await app.api.depositSign.signItem(signId, signItem);
  const signResponse: any = await app.api.patient.signPersonRequest(patientId, personRequestId, signId);
  expect(signResponse.data.status, 'expect person request status to be Approved').toBe('Approved');

  // Ensure synchronization
  await expect
    .poll(
      async () => {
        const patientDetailsResponse: any = await app.api.patient.getPatientById(patientId);
        return patientDetailsResponse?.data?.ehealthSync?.status;
      },
      {
        message: 'Make sure patient synchronized successfully',
        timeout: 15000,
      },
    )
    .toStrictEqual('Synchronized');

  // Ensure patientIdExistInEHealth to avoid caching issues on their side
  await expect
    .poll(
      async () => {
        const response: any = await app.api.patient.searchPatientInEHealth(firstName, lastName, birthDate);
        return response?.data?.[0].patient?.ehealthSync?.status;
      },
      {
        message: 'Make sure patient synchronized successfully',
        timeout: 15000,
      },
    )
    .toStrictEqual('Synchronized');

  //Hardcoded delay to avoid caching issues on the e-Health side (patient doesn't exist error)
  await delay(5000);

  return { patientId, firstName, lastName, birthDate, middleName };
}
