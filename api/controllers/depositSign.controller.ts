import { step } from '../../utils/step';
import { BaseController } from './base.controller';
import { DepositSignSignature } from '../../models/doctor.model';

export class DepositSignController extends BaseController {
  @step('Get Deposit Sign Token')
  async getDSToken(data: DepositSignSignature) {
    return (
      await this.request()
        .url(`/sign/api/v2/helsi/depositSign/token`)
        .method('POST')
        .body({
          Login: data.login,
          Password: data.password,
        })
        .send()
    ).body;
  }
  @step('Validate Deposit Sign Password')
  async validateDSPassword(data: DepositSignSignature, token: string) {
    return (
      await this.request()
        .url(`/sign/api/v2/helsi/depositSign/key/${data.keyNameId}/password/validate`)
        .method('POST')
        .body({
          Token: token,
          Password: data.passwordForKey,
        })
        .send()
    ).body;
  }

  @step('Sign Event Item')
  async signItem(signId: string, data: any) {
    return (
      await this.request()
        .url(`/sign/api/v2/helsi/depositSign/item/${signId}/sign`)
        .method('POST')
        .body(data)
        .send()
    ).body;
  }
}
