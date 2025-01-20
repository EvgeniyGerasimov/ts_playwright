import { APIRequestContext, test } from '@playwright/test';
import { baseURL } from '../playwright.config';

export class RequestClient {
  protected options: Partial<{
    prefixUrl: string;
    url: string;
    method: string;
    headers: Record<string, string>;
    params: { [key: string]: string | number | boolean };
    data?: any;
    form?: Record<string, string>;
    baseUrlOverride?: string;
    body?: string;
    multipart?: FormData;
  }> = {};
  private defaultBaseUrl: string = baseURL;

  constructor(private request: APIRequestContext) {}

  public newRequest(): this {
    this.options = {}; // Reset options for a new request
    return this;
  }

  public url(url: string | URL, baseUrlOverride?: string): this {
    this.options.url = baseUrlOverride ? baseUrlOverride + url.toString() : this.defaultBaseUrl + url.toString();
    return this;
  }

  public method(method: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH'): this {
    this.options.method = method;
    return this;
  }

  public headers(headers: Record<string, string>): this {
    this.options.headers = {
      ...this.options.headers,
      ...headers,
    };
    return this;
  }

  public form(data: Record<string, string>): this {
    this.options.form = data;
    return this;
  }

  public body(data: any): this {
    this.options.data = data;
    return this;
  }

  public formData(formData: any): this {
    this.options.multipart = formData;
    this.options.headers = {
      ...this.options.headers,
    };
    return this;
  }

  public async send<T = unknown>(): Promise<{
    body: T;
    headers: Record<string, string>;
  }> {
    if (!this.options.url) {
      throw new Error('[RequestClient] URL is undefined. Use .url("some/url") before .send().');
    }

    // Directly pass `this.options` into the `fetch` call
    const response = await this.request.fetch(this.options.url, {
      ...this.options,
    });

    // Debugging logs if enabled
    if (process.env.PRINT_API_REQUEST === 'true') {
      console.log(`REQUEST INFO: ${JSON.stringify({ url: this.options.url, ...this.options }, null, 2)}`);
    }

    if (!response.ok()) {
      const responseBody = await response.text();
      const requestBody = this.options.data
        ? JSON.stringify(this.options.data) // Convert to JSON string if it exists
        : 'No request body';
      const logMessage = `
        Request failed:
        - Method: ${this.options.method}
        - URL: ${this.options.url}
        - Status: ${response.status()}
        - Request body: ${requestBody} 
        - Response Body: ${responseBody}`;

      console.error(logMessage);

      // Attach the log to the Playwright test info
      const testInfo = test.info();
      testInfo.attach('Request Details', {
        body: logMessage,
        contentType: 'text/plain',
      });
      //Fail test step
      throw new Error(logMessage);
    }

    const contentType = response.headers()['content-type'];
    if (contentType && contentType.includes('application/json')) {
      const responseBody = await response.json();
      if (process.env.PRINT_API_RESPONSE === 'true') {
        console.log(`RESPONSE: ${JSON.stringify(responseBody, null, 2)}`);
      }
      return {
        body: responseBody as T,
        headers: response.headers(),
      };
    } else {
      return {
        body: null as T,
        headers: response.headers(),
      };
    }
  }
}
