import { financeFixture as test } from '../../../fixtures/finance.fixture';
import { doctors, patients } from '../../../playwright.config';
import { dictionary } from '../../../data/dictionary';
import { episodeTypes } from '../../../data/episodeTypes';
import { financePackages } from '../../../data/finance/financePackages';
import { appointmentTypes } from '../../../data/appointmentTypes';
import { financeMessages } from '../../../data/finance/financeMessages';
import { incorrectDiagnosesFor24Package } from '../../../data/finance/incorrectDiagnosesFor24Package';

const diagnosesFor24Package = Object.values(incorrectDiagnosesFor24Package);
const psychiatristDoctor = doctors.psychiatristDoctor;
const patientId = patients.adultFinance;
const reason = dictionary.icpc2Reasons.fullMedicalExam;
const receptionService = dictionary.receptionService.T67002;
const episodeType = episodeTypes.palliativeCare;
const financePackage = financePackages.package24;
const appointmentType = appointmentTypes.intervention;
const errorMessageTitle = financeMessages.missingDiagnosesForPackage24Title;
const errorMessageText = financeMessages.missingDiagnosesForPackage24Text;

test.use({doctor: psychiatristDoctor, patientId:patientId})

diagnosesFor24Package.forEach((diagnose) => {
  test(`Check correspondence of main diagnose ${diagnose.code} to Package 24`, { tag: ['@finance', '@package24', '@new'] },
    async ({ app }) => {

      await app.reception.selectAppointmentType(appointmentType);
      await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
      await app.reception.selectFinancePackage(financePackage);

      await app.reception.financeModal.validateMessageIsNotDisplayed(errorMessageTitle, errorMessageText);
    },
  );
});
