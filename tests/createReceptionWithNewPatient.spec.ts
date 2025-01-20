import { doctors } from '../playwright.config';
import { patientFixture as test } from '../fixtures/patient.fixture';
import { dictionary } from '../data/dictionary';
import { episodeTypes } from '../data/episodeTypes';

test('Create patient via API and first line reception via UI', { tag: ['@smoke', '@regression'] },
  async ({ app, patient }) => {
    const fileKey = doctors.familyDoctor.fileKey;
    const reason = dictionary.icpc2Reasons.fullMedicalExam;
    const action = dictionary.icpc2Actions.partialMedicalExam;
    const diagnose = dictionary.icpc2Diagnosis.fever;
    const doctor = doctors.familyDoctor;

    await app.headlessLogin(doctor);

    await app.home.openHomePage(doctor.passwordEHealth);

    await app.patient.open(patient.patientId);
    await app.patient.startReceptionNow();

    await app.reception.expectLoaded();
    await app.reception.fillInFirstLineReceptionDetails(reason, diagnose, action);
    await app.reception.signReception(fileKey);
    await app.reception.syncNowWithRetry();
    await app.reception.verifySyncStatus();
  },
);

test(
  'Create patient via API and second line reception via UI',
  { tag: ['@smoke', '@regression'] },
  async ({ app, patient }) => {
    const doctor = doctors.psychiatristDoctor;
    const fileKey = doctors.psychiatristDoctor.fileKey;
    const reason = dictionary.icpc2Reasons.fullMedicalExam;
    const receptionService = dictionary.receptionService.T67002;
    const diagnose = dictionary.icd10AmDiagnosis.diabetes;
    const episodeType = episodeTypes.treatment;

    await app.headlessLogin(doctor);

    await app.home.openHomePage(doctor.passwordEHealth);

    await app.patient.open(patient.patientId);
    await app.patient.startReceptionNow();

    await app.reception.expectLoaded();
    await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
    await app.reception.signReception(fileKey);
    await app.reception.syncNowWithRetry();
    await app.reception.verifySyncStatus();
  },
);
