import { DoctorResources } from '../../models/doctor.model';

export const doctorResources: DoctorResources = {
  familyDoctor: {
    email: 'f.reorganized+300424+aqa+doctor@gmail.com',
    password: 'Test12341234',
    passwordEHealth: 'Test12341234',
    depositSignSignature: {
      login: '380506620376',
      password: '111',
      keyNameId: 'f0d411f8-a5d8-4c88-8f43-2e4da7374b7e',
      passwordForKey: 'mashakey3101',
    },
    fileKey: {
      keyPath: `../../../resources/aqa/keys/family_doctor.dat`,
      keyPin: '111',
    },
  },
  psychiatristDoctor: {
    email: 'f.reorganized+110624+aqa+psykhiatr@gmail.com',
    password: 'Test12341234',
    passwordEHealth: 'Test12341234',
    depositSignSignature: {
      login: '',
      password: '',
      keyNameId: '',
      passwordForKey: '',
    },
    fileKey: {
      keyPath: `../../../resources/aqa/keys/psychiatrist_doctor.dat`,
      keyPin: '111',
    },
  },
};

export default doctorResources;
