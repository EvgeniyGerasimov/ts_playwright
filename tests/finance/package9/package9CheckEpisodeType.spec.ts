import { financeFixture as test } from '../../../fixtures/finance.fixture';
import { doctors, patients } from '../../../playwright.config';
import { dictionary } from '../../../data/dictionary';
import { financePackages } from '../../../data/finance/financePackages';
import { episodeTypes } from '../../../data/episodeTypes';
import { financeMessages } from '../../../data/finance/financeMessages';
import { getEntriesByValues } from '../../../utils/helpers';

const psychiatristDoctor = doctors.psychiatristDoctor;
const patientId = patients.adultFinance;
const reason = dictionary.icpc2Reasons.fullMedicalExam;
const receptionService = dictionary.receptionService.T67002;
const diagnose = dictionary.icd10AmDiagnosis.diabetes;
const financePackage = financePackages.package9;
const errorMessageTitle = financeMessages.incorrectEpisodeType;
const errorMessageText = financeMessages.allowedEpisodeTypes;
const invalidTypesSet = new Set([
  episodeTypes.palliativeCare,
  episodeTypes.rehabilitation
]);

const invalidAppointmentTypes = getEntriesByValues(episodeTypes, invalidTypesSet);


test.use({doctor: psychiatristDoctor, patientId:patientId})

test('Check Package9 with treatment Episode Type', { tag: ['@finance', '@package9'] }, async ({ app }) => {
  const episodeType = episodeTypes.treatment;

  await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
  await app.reception.selectFinancePackage(financePackage);

  await app.reception.financeModal.validateSuccessMessage();
});


invalidAppointmentTypes.forEach(([key, episodeType]) => {
  test(`Check Package9 with ${key} Episode Type (negative)`, { tag: ['@finance', '@package9'] }, async ({ app }) => {
    await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
    await app.reception.selectFinancePackage(financePackage);

    await app.reception.financeModal.validateErrorMessage(errorMessageTitle, errorMessageText);
  });
});
