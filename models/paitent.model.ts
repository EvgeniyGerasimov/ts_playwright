export interface PatientResources {
  adult: string;
  olderThan40: string;
  adultFinance: string;
}

export interface PatientData {
  firstName: string;
  lastName: string;
  birthDate: string;
  middleName: string;
}

export interface CreatePatientParams {
  firstName: string;
  lastName: string;
  birthDate: string;
  sex: boolean;
  phone: string;
  consentType: string;
}
