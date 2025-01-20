import { receptionFixture as test } from '../fixtures/reception.fixture';
import { ReceptionFixtureOptions } from '../models/fixtureOptions.model';
import { doctors } from '../playwright.config';
import { dictionary } from '../data/dictionary';
import { EpisodeTypeAPI } from '../models/episode.model';
import { EncounterClassOptions } from '../models/encounter';

test.describe(' ', () => {
  const doctor = doctors.familyDoctor;
  const fileKey = doctor.fileKey;
  const firstLineReception: ReceptionFixtureOptions = {
    doctor: doctor,
    reason: dictionary.icpc2Reasons.fullMedicalExam,
    diagnose: dictionary.icpc2Diagnosis.fever,
    actionOrService: dictionary.icpc2Actions.partialMedicalExam,
    encounterClass: EncounterClassOptions.primaryCare,
  };

  test.use({ receptionOptions: firstLineReception });
  test('Cancel signed first line reception', { tag: ['@smoke', '@regression'] },
    async ({ app, patient, reception }) => {
      await app.headlessLogin(doctor);

      await app.home.openHomePage(doctor.passwordEHealth);

      await app.patient.open(patient.patientId);

      await app.reception.openReceptionById(patient.patientId, reception.eventId);
      await app.reception.cancelReception();
      await app.reception.signCancelReception(fileKey);
      await app.reception.syncNow();
      await app.reception.verifyCancelReceptionSyncStatus();
    },
  );
});

test.describe(' ', () => {
  const doctor = doctors.psychiatristDoctor;
  const fileKey = doctor.fileKey;
  const secondLineReception: ReceptionFixtureOptions = {
    doctor: doctor,
    reason: dictionary.icpc2Reasons.fullMedicalExam,
    diagnose: dictionary.icd10AmDiagnosis.diabetes,
    actionOrService: dictionary.receptionService.T67002,
    encounterClass: EncounterClassOptions.ambulatory,
    episodeType: EpisodeTypeAPI.DIAGNOSTIC,
  };

  test.use({ receptionOptions: secondLineReception });
  test('Cancel signed second line reception', { tag: ['@smoke', '@regression'] },
    async ({ app, patient, reception }) => {
      await app.headlessLogin(doctor);

      await app.home.openHomePage(doctor.passwordEHealth);

      await app.patient.open(patient.patientId);

      await app.reception.openReceptionById(patient.patientId, reception.eventId);
      await app.reception.cancelReception();
      await app.reception.signCancelReception(fileKey);
      await app.reception.syncNow();
      await app.reception.verifyCancelReceptionSyncStatus();
    },
  );
});
