export class PhoneInfoParamsBuilder {
  private model: any;
  constructor() {
    this.model = {
      number: '',
      typeId: '3', // no e-health phone number
    };
  }

  public build() {
    return this.model;
  }
}
