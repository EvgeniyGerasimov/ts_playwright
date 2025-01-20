import { DoctorResources } from '../models/doctor.model';
import { PatientResources } from '../models/paitent.model';
import aqaDoctors from './aqa/doctor.resources';
import qaDoctors from './qa/doctor.resources';
import studyDoctors from './study/doctor.resources';
import aqaPatients from './aqa/patient.resources';
import qaPatients from './qa/patient.resources';
import studyPatients from './study/patient.resources';

export interface EnvironmentResources {
  doctors: DoctorResources;
  patients: PatientResources;
}

const resources: Record<string, EnvironmentResources> = {
  aqa: {
    doctors: aqaDoctors,
    patients: aqaPatients,
  },
  qa: {
    doctors: qaDoctors,
    patients: qaPatients,
  },
  study: {
    doctors: studyDoctors,
    patients: studyPatients,
  },
};

export default resources;
