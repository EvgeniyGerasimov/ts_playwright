export interface DoctorResources {
  psychiatristDoctor: Doctor;
  familyDoctor: Doctor;
}

export interface Doctor {
  email: string;
  password: string;
  passwordEHealth: string;
  depositSignSignature: DepositSignSignature;
  fileKey: FileKey;
}

export interface DepositSignSignature {
  login: string;
  password: string;
  keyNameId: string;
  passwordForKey: string;
}

export interface FileKey {
  keyPath: string;
  keyPin: string;
}
