import { baseFixture } from './base.fixture';
import { Doctor } from '../models/doctor.model';
import { Application } from '../app';

export const financeFixture  = baseFixture.extend<{
  doctor: Doctor
  finance: Application
  patientId: string
}>({
  doctor: undefined, // Placeholder for doctor to override during test setup
  patientId: undefined, // Placeholder for patientId to override during test setup

  finance: [async ({ app, doctor, patientId }, use) => {
    if (!doctor || !patientId) {
      throw new Error('Doctor and patientId options must be provided.');
    }

    await app.headlessLogin(doctor);

    await app.home.openHomePage(doctor.passwordEHealth);

    await app.patientsList.open();

    await app.patient.open(patientId);
    await app.patient.startReceptionNow();

    await app.reception.expectLoaded();

    // Use the prepared application
    await use(app);

  },{ auto: true }]
})