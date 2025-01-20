import { CreatePatientParams, PatientData } from '../../models/paitent.model';

export class CreatePatientBuilder {
  private model: CreatePatientParams;
  constructor(patientData: PatientData) {
    this.model = {
      firstName: patientData.firstName,
      lastName: patientData.lastName,
      birthDate: patientData.birthDate,
      sex: true,
      phone: '',
      consentType: 'BLANK',
    };
  }

  public build() {
    return this.model;
  }
}
