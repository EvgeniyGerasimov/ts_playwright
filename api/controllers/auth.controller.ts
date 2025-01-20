import { BaseController } from './base.controller';
import { authHost } from '../../playwright.config';
import { step } from '../../utils/step';
import { getCookiesString } from '../../utils/helpers';

export class AuthController extends BaseController {
  @step("Get token by user's credentials")
  async login(data: any): Promise<any> {
    return (
      await this.request()
        .url('/connect/token', authHost)
        .method('POST')
        .form(data)
        .headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
        .send()
    ).body;
  }

  @step('Authorize with token')
  async getCookie(data: { access_token: string; refresh_token: string }): Promise<string> {
    const response = await this.request()
      .url('/api/authorize/token')
      .method('POST')
      .body(data)
      .headers({ 'Content-Type': 'application/json' })
      .send();

    return getCookiesString(response);
  }


  @step('Get user info')
  async getUserInfo(): Promise<any> {
    return (
      await this.request()
        .url('/api/user/me')
        .send()
    ).body;
  }
}
