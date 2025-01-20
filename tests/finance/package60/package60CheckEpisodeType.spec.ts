import { financeFixture as test } from '../../../fixtures/finance.fixture';
import { doctors, patients } from '../../../playwright.config';
import { dictionary } from '../../../data/dictionary';
import { financePackages } from '../../../data/finance/financePackages';
import { episodeTypes } from '../../../data/episodeTypes';
import { financeMessages } from '../../../data/finance/financeMessages';

const psychiatristDoctor = doctors.psychiatristDoctor;
const patientId = patients.adultFinance;
const reason = dictionary.icpc2Reasons.fullMedicalExam;
const receptionService = dictionary.receptionService.L67001;
const diagnose = dictionary.icd10AmDiagnosis.diabetes;
const financePackage = financePackages.package60;
const errorMessageTitle = financeMessages.incorrectEpisodeType;
const errorMessageText = financeMessages.incorrectEpisodeTypeForPackage60Text;

const invalidEpisodeTypes = Object.entries(episodeTypes).filter(([, value]) => value !== episodeTypes.diagnostic);

test.use({doctor: psychiatristDoctor, patientId:patientId})

invalidEpisodeTypes.forEach(([key, episodeType]) => {
  test(`Check Package60 with ${key} Episode Type`, { tag: ['@finance', '@package9'] }, async ({ app }) => {

    await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
    await app.reception.selectFinancePackage(financePackage);

    await app.reception.financeModal.validateErrorMessage(errorMessageTitle, errorMessageText);
  });
});

test('Check Package60 with diagnostic Episode Type (positive)', { tag: ['@finance', '@package9'] },
  async ({ app }) => {
    const episodeType = episodeTypes.diagnostic;

    await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
    await app.reception.selectFinancePackage(financePackage);

    await app.reception.financeModal.validateMessageIsNotDisplayed(errorMessageTitle, errorMessageText);
  },
);
