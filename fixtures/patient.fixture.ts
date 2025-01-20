import { baseFixture } from './base.fixture';
import { Doctor } from '../models/doctor.model';
import { generateTestPatient } from '../utils/testDataGenerator';
import { createPatientViaAPI } from '../utils/api/createPatient';
import { PatientFixtureOptions } from '../models/fixtureOptions.model';
import { doctors } from '../playwright.config';

export const patientFixture = baseFixture.extend<{
  doctor: Doctor;
  patient: PatientFixtureOptions;
}>({
  doctor: [doctors.familyDoctor, { option: true }], // use familyDoctor by default to create patient
  patient: async ({ app, doctor, context }, use) => {
    // Login
    await app.headlessLogin(doctor);

    // Create patient via API
    const patientData = generateTestPatient();
    const patient = await createPatientViaAPI(app, doctor, patientData);

    //Clear auth cookies
    await context.clearCookies();

    // Pass patient data to the test
    await use(patient);
  },
});
