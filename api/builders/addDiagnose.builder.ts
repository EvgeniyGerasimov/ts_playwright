import { Diagnose } from '../../models/diagnose.model';
import { getDateHelper } from '../../utils/helpers';

export class AddDiagnoseBuilder {
  private model: Diagnose;
  constructor() {
    this.model = {
      role: 'Primary',
      condition: {
        clinicalStatus: 'Active',
        verificationStatus: 'Confirmed',
        severity: null,
        onsetDate: getDateHelper(-2, 'minutes'),
        syncWithEncounterDate: true,
        code: {
          icpc2Id: null,
          icd10Id: null,
          icd10AmId: null,
          text: '',
        },
        evidences: [],
      },
    };
  }

  public icpc2Id(icpc2Id: string) {
    this.model.condition.code.icpc2Id = icpc2Id;
    return this;
  }

  public icd10Am(icd10AmId: string) {
    this.model.condition.code.icd10AmId = icd10AmId;
    return this;
  }

  public changeDefaultClinicalStatus(clinicalStatus: string) {
    this.model.condition.clinicalStatus = clinicalStatus;
    return this;
  }

  public changeDefaultVerificationStatus(verificationStatus: string) {
    this.model.condition.verificationStatus = verificationStatus;
    return this;
  }

  public build() {
    return this.model;
  }
}
