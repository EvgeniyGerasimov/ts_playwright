import { BaseController } from './base.controller';
import { step } from '../../utils/step';

export class DisRestSignerController extends BaseController {
  @step('Register signer')
  async registerSigner(data: any) {
    return (
      await this.request()
        .url(`/api/disrest/api/v2/signer/signer/register`)
        .method('POST')
        .body(data)
        .send()
    ).body;
  }
}
