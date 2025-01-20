import { step } from '../../utils/step';
import { BaseController } from './base.controller';

export class EncounterController extends BaseController {
  @step('Get encounter by id')
  async getEncounterById(patientId: string, encounterId: string) {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/encounters/${encounterId}`)
        .send()
    ).body;
  }
}
