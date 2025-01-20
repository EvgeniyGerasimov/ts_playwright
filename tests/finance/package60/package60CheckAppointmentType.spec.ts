import { financeFixture as test } from '../../../fixtures/finance.fixture';
import { doctors, patients } from '../../../playwright.config';
import { dictionary } from '../../../data/dictionary';
import { financePackages } from '../../../data/finance/financePackages';
import { episodeTypes } from '../../../data/episodeTypes';
import { financeMessages } from '../../../data/finance/financeMessages';
import { appointmentTypes } from '../../../data/appointmentTypes';
import { getEntriesByValues } from '../../../utils/helpers';

const psychiatristDoctor = doctors.psychiatristDoctor;
const patientId = patients.adultFinance;
const reason = dictionary.icpc2Reasons.fullMedicalExam;
const receptionService = dictionary.receptionService.L67001;
const diagnose = dictionary.icd10AmDiagnosis.diabetes;
const financePackage = financePackages.package60;
const errorMessageTitle = financeMessages.unpaidEventTypeForPackage60Title;
const errorMessageText = financeMessages.unpaidEventTypeForPackage60Text;
const episodeType = episodeTypes.diagnostic;

const invalidTypesSet = new Set([
  appointmentTypes.videoConsultation,
  appointmentTypes.visitToPatient,
  appointmentTypes.outsideMedicalFacility,
]);
const invalidAppointmentTypes = getEntriesByValues(appointmentTypes, invalidTypesSet);

const validTypeSet = new Set([
  appointmentTypes.intervention,
  appointmentTypes.inTheHealthCareInstitution,
]);
const validAppointmentTypes = getEntriesByValues(appointmentTypes, validTypeSet);


test.use({doctor: psychiatristDoctor, patientId:patientId})

invalidAppointmentTypes.forEach(([key, appointmentType]) => {
  test(`Check Package60 with ${key} appointment type (negative)`, { tag: ['@finance', '@package60'] },
    async ({ app }) => {

      await app.reception.selectAppointmentType(appointmentType);
      await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
      await app.reception.selectFinancePackage(financePackage);

      await app.reception.financeModal.validateErrorMessage(errorMessageTitle, errorMessageText);
    },
  );
});


validAppointmentTypes.forEach(([key, appointmentType]) => {
  test(`Check Package60 with ${key} appointment type (positive)`,
    { tag: ['@finance', '@package60'] },
    async ({ app }) => {

      await app.reception.selectAppointmentType(appointmentType);
      await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
      await app.reception.selectFinancePackage(financePackage);

      await app.reception.financeModal.validateMessageIsNotDisplayed(errorMessageTitle, errorMessageText);
    },
  );
});
