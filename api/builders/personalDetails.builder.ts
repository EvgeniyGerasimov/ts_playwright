import { birthDateToUnzr } from '../../utils/helpers';
import { PatientData } from '../../models/paitent.model';

export class PersonalDetailsBuilder {
  private model: any;
  constructor(patientId: string, patientData: PatientData) {
    this.model = {
      ehealthSync: {
        isAssociated: false,
        error: {
          errors: [],
        },
        status: 'ReadyToSync',
      },
      hasNoTaxId: false,
      primaryPatientId: patientId,
      secondaryPatientIds: [patientId],
      duplicateState: 1,
      isDeclarationExist: false,
      isPreperson: false,
      isIdentified: false,
      isTechPatient: false,
      hasFcm: false,
      status: 'Active',
      cardOrganization: 'None',
      patientId: patientId,
      lastName: patientData.lastName,
      isVerificate: false,
      middleName: patientData.middleName,
      firstName: patientData.firstName,
      birthDate: patientData.birthDate, //"2000-01-01",
      sex: true,
      countryOfBirthId: '88',
      cityOfBirth: 'Київ',
      taxId: '3431423234',
      countryId: '88',
      countryType: 0,
      unzr: birthDateToUnzr(patientData.birthDate),
      resident: 'true',
    };
  }

  public overrideBirthDate(birthDate: string) {
    this.model.birthDate = birthDate;
  }

  public build() {
    return this.model;
  }
}
