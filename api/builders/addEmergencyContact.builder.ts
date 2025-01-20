export class AddEmergencyContactBuilder {
  private model: any;
  constructor() {
    this.model = {
      patient: {
        patientId: '',
      },
      firstName: 'Тест',
      lastName: 'Автотест',
      middleName: 'Тестович',
      phone: '0665136276',
    };
  }

  public build() {
    return this.model;
  }
}
