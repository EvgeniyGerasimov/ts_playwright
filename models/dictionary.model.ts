export interface DictionaryEntry {
  code: string;
  name: string;
}

export interface Dictionary {
  icpc2Reasons: Record<string, DictionaryEntry>;
  icpc2Actions: Record<string, DictionaryEntry>;
  icpc2Diagnosis: Record<string, DictionaryEntry>;
  icd10AmDiagnosis: Record<string, DictionaryEntry>;
  receptionService: Record<string, DictionaryEntry>;
  procedureService: Record<string, DictionaryEntry>;
  diagnosticReportService: Record<string, DictionaryEntry>;
  consultationService: Record<string, DictionaryEntry>;
}
