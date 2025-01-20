import { doctors } from '../../../playwright.config';
import { dictionary } from '../../../data/dictionary';
import { serviceRequestFixture as test } from '../../../fixtures/serviceRequest.fixture';
import { ReceptionFixtureOptions } from '../../../models/fixtureOptions.model';
import { episodeTypes } from '../../../data/episodeTypes';
import { financePackages } from '../../../data/finance/financePackages';
import { EncounterClassOptions } from '../../../models/encounter';

const diagnosticService = dictionary.consultationService.psychiatristConsultation;
const firstLineReception: ReceptionFixtureOptions = {
  doctor: doctors.familyDoctor,
  reason: dictionary.icpc2Reasons.fullMedicalExam,
  diagnose: dictionary.icpc2Diagnosis.fever,
  actionOrService: dictionary.icpc2Actions.partialMedicalExam,
  encounterClass: EncounterClassOptions.primaryCare,
};

const psychiatristDoctor = doctors.psychiatristDoctor;
const reason = dictionary.icpc2Reasons.fullMedicalExam;
const receptionService = dictionary.receptionService.T67002;
const diagnose = dictionary.icd10AmDiagnosis.diabetes;
const episodeType = episodeTypes.treatment;
const financePackage = financePackages.package9;

test.use({ receptionOptions: firstLineReception, service: diagnosticService });
test('Check Package9 with service request', { tag: ['@finance', '@package9'] },
  async ({ app, patient, serviceRequest }) => {
    await app.headlessLogin(psychiatristDoctor);

    await app.home.openHomePage(psychiatristDoctor.passwordEHealth);

    await app.patient.open(patient.patientId);
    await app.patient.startReceptionNow();

    await app.reception.expectLoaded();
    await app.reception.addServiceRequest(serviceRequest.requisitionNumber, diagnosticService.code);
    await app.reception.fillInSecondLineReceptionDetails(reason, diagnose, receptionService, episodeType);
    await app.reception.selectFinancePackage(financePackage);

    await app.reception.financeModal.validateSuccessMessage();
  },
);
