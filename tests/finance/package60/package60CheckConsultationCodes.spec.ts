import { financeFixture as test } from '../../../fixtures/finance.fixture';
import { episodeTypes } from '../../../data/episodeTypes';
import { doctors, patients } from '../../../playwright.config';
import { dictionary } from '../../../data/dictionary';
import { financePackages } from '../../../data/finance/financePackages';
import { financeMessages } from '../../../data/finance/financeMessages';

const psychiatristDoctor = doctors.psychiatristDoctor;
const patientId = patients.adultFinance;
const reason = dictionary.icpc2Reasons.fullMedicalExam;
const diagnose = dictionary.icd10AmDiagnosis.Z023;
const financePackage = financePackages.package60;
const episodeType = episodeTypes.diagnostic;
const mandatoryConsultationCodeMissing = financeMessages.mandatoryConsultationCodeMissing;
const consultationCodeMissing = financeMessages.consultationCodeMissing;

test.use({doctor: psychiatristDoctor, patientId:patientId})

test('Check Package60 with all consultation codes', { tag: ['@finance', '@package9'] }, async ({ app }) => {
  const receptionServices = [
    dictionary.receptionService.A67002,
    dictionary.receptionService.N67002,
    dictionary.receptionService.A67003,
    dictionary.receptionService.F67002,
    dictionary.receptionService.P67002,
    dictionary.receptionService.A67021,
  ];


  await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionServices, episodeType);
  await app.reception.selectFinancePackage(financePackage);

  await app.reception.financeModal.validateSuccessMessage();
});

test('Check Package60 with missing A67002 consultation code', { tag: ['@finance', '@package9'] }, async ({ app }) => {
  const receptionServices = [
    dictionary.receptionService.N67002,
    dictionary.receptionService.A67003,
    dictionary.receptionService.F67002,
    dictionary.receptionService.P67002,
    dictionary.receptionService.A67021,
  ];

  await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionServices, episodeType);
  await app.reception.selectFinancePackage(financePackage);

  await app.reception.financeModal.validateSuccessMessage();
  await app.reception.financeModal.validateInfoMessage(mandatoryConsultationCodeMissing);
  await app.reception.financeModal.validateMessageWithDynamicText(
    consultationCodeMissing,
    dictionary.receptionService.A67002.name,
  );
});
