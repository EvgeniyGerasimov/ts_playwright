import { financeFixture as test } from '../../../fixtures/finance.fixture';
import { doctors, patients } from '../../../playwright.config';
import { dictionary } from '../../../data/dictionary';
import { episodeTypes } from '../../../data/episodeTypes';
import { financePackages } from '../../../data/finance/financePackages';
import { appointmentTypes } from '../../../data/appointmentTypes';
import { financeMessages } from '../../../data/finance/financeMessages';

const psychiatristDoctor = doctors.psychiatristDoctor;
const patientId = patients.adultFinance;
const reason = dictionary.icpc2Reasons.fullMedicalExam;
const receptionService = dictionary.receptionService.T67002;
const diagnose = dictionary.icd10AmDiagnosis.diabetes;
const episodeType = episodeTypes.treatment;
const financePackage = financePackages.package9;
const errorMessageTitle = financeMessages.incorrectTypeEventTitle;
const errorMessageText = financeMessages.incorrectTypeEventText;

const validAppointmentTypes = Object.entries(appointmentTypes).filter(
  ([, value]) => value !== appointmentTypes.intervention,
);

test.use({doctor: psychiatristDoctor, patientId:patientId})

test('Check Package9 with intervention appointment (negative)', { tag: ['@finance', '@package9'] },
  async ({ app }) => {
    const appointmentType = appointmentTypes.intervention;

    await app.reception.selectAppointmentType(appointmentType);
    await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
    await app.reception.selectFinancePackage(financePackage);

    await app.reception.financeModal.validateErrorMessage(errorMessageTitle, errorMessageText);
  },
);

validAppointmentTypes.forEach(([key, appointmentType]) => {
  test(`Check Package9 with '${key}' appointment type`, { tag: ['@finance', '@package9'] },
    async ({ app }) => {

    await app.reception.selectAppointmentType(appointmentType);
    await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
    await app.reception.selectFinancePackage(financePackage);

    await app.reception.financeModal.validateSuccessMessage();
  });
});


