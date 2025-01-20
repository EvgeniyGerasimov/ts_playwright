import { BaseController } from './base.controller';
import { step } from '../../utils/step';

export class ServiceRequestController extends BaseController {
  @step('Create service request')
  async createAppointment(data: any) {
    return (
      await this.request()
        .url('/api/disrest/api/v2/appointment')
        .body(data).method('POST')
        .send()
    ).body;
  }

  @step('Send service request')
  async sendAppointment(appointmentId: string, signId: string) {
    return (
      await this.request()
        .url(`/api/disrest/api/v2/appointment/${appointmentId}/send`)
        .body({ itemId: signId })
        .method('POST')
        .send()
    ).body;
  }

  @step('Get service request')
  async getAppointmentDetails(appointmentId: string) {
    return (
      await this.request()
        .url(`/api/disrest/api/v2/appointment/${appointmentId}/details`)
        .send()
    ).body;
  }
}
