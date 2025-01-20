import { DepositSignSignature } from '../../models/doctor.model';

export class SignDSBuilder {
  private model: any;
  constructor(data: DepositSignSignature, token: string) {
    this.model = {
      Token: token,
      KeyName: data.keyNameId,
      KeyPassword: data.passwordForKey,
      Edrpou: '26188567',
      Drfo: '3551412348',
    };
  }

  public build() {
    return this.model;
  }
}
