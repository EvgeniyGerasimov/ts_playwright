import { APIRequestContext } from '@playwright/test';
import { RequestClient } from '../requestClient';

export abstract class BaseController {
  protected requestClient: RequestClient;

  constructor(protected apiRequest: APIRequestContext) {
    this.requestClient = new RequestClient(apiRequest);
  }

  protected request(): RequestClient {
    return this.requestClient.newRequest();
  }
}
