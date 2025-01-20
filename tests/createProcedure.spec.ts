import { test } from '@playwright/test';
import { Application } from '../app';
import { doctors, patients } from '../playwright.config';
import { dictionary } from '../data/dictionary';
import { episodeTypes } from '../data/episodeTypes';

test('Create procedure in first line reception', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
  const familyDoctor = doctors.familyDoctor;
  const fileKey = doctors.familyDoctor.fileKey;
  const patientId = patients.adult;
  const reason = dictionary.icpc2Reasons.fullMedicalExam;
  const action = dictionary.icpc2Actions.partialMedicalExam;
  const diagnose = dictionary.icpc2Diagnosis.fever;
  const procedure = dictionary.procedureService.acupuncture;

  const app = new Application(page);

  await app.headlessLogin(familyDoctor);

  await app.home.openHomePage(familyDoctor.passwordEHealth);

  await app.patient.open(patientId);
  await app.patient.startReceptionNow();

  await app.reception.expectLoaded();
  await app.reception.goToMedicalRecords();

  await app.medicalRecords.expectLoaded();
  await app.medicalRecords.addProcedure();

  await app.procedure.expectLoaded();
  await app.procedure.fillInProcedureDetails(procedure);
  await app.procedure.submitProcedure();

  await app.medicalRecords.expectLoaded();
  await app.medicalRecords.verifyEntityIsAddedToMedicalRecords(procedure.name);

  await app.reception.goToReception();
  await app.reception.fillInFirstLineReceptionDetails(reason, diagnose, action);
  await app.reception.signReception(fileKey);
  await app.reception.syncNow();
  await app.reception.verifySyncStatus();
});

test('Create procedure in second line reception', { tag: ['@smoke', '@regression'] }, async ({ page }) => {
  const psychiatristDoctor = doctors.psychiatristDoctor;
  const fileKey = doctors.psychiatristDoctor.fileKey;
  const patientId = patients.adult;
  const reason = dictionary.icpc2Reasons.fullMedicalExam;
  const receptionService = dictionary.receptionService.T67002;
  const diagnose = dictionary.icd10AmDiagnosis.diabetes;
  const procedure = dictionary.procedureService.psychologicalSkillsTraining;
  const episodeType = episodeTypes.treatment;

  const app = new Application(page);

  await app.headlessLogin(psychiatristDoctor);

  await app.home.openHomePage(psychiatristDoctor.passwordEHealth);

  await app.patient.open(patientId);
  await app.patient.startReceptionNow();

  await app.reception.expectLoaded();
  await app.reception.goToMedicalRecords();

  await app.medicalRecords.expectLoaded();
  await app.medicalRecords.addProcedure();

  await app.procedure.expectLoaded();
  await app.procedure.fillInProcedureDetails(procedure);
  await app.procedure.submitProcedure();

  await app.medicalRecords.expectLoaded();
  await app.medicalRecords.verifyEntityIsAddedToMedicalRecords(procedure.name);

  await app.reception.goToReception();
  await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
  await app.reception.signReception(fileKey);
  await app.reception.syncNow();
  await app.reception.verifySyncStatus();
});
