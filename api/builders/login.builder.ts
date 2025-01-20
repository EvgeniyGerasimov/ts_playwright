import { LoginFormModel } from '../../models/loginForm.model';

export class LoginBuilder {
  private model: LoginFormModel;
  constructor(email: string, password: string) {
    this.model = {
      grant_type: 'password',
      client_id: 'hisclient',
      client_secret: '191945141ee9abed24049dfcd0ece610',
      username: email,
      password: password,
    };
  }

  public build() {
    return this.model;
  }
}
