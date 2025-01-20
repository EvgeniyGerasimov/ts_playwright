export interface Code {
  icpc2Id: string | null;
  icd10Id: string | null;
  icd10AmId: string | null;
  text: string;
}

export interface Condition {
  clinicalStatus: string;
  verificationStatus: string;
  severity: string | null;
  onsetDate: string;
  syncWithEncounterDate: boolean;
  code: Code;
  evidences: any[]; // assuming evidences is an array of any type
}

export interface Diagnose {
  role: string;
  condition: Condition;
}
