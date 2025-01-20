import { BaseController } from './base.controller';
import { step } from '../../utils/step';

export class DisRestDictionaryController extends BaseController {
  @step('Get services from disrest dictionary')
  async getServiceFromDict(recourceId: string, searchParam: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/disrest/api/v2/dict/services/${recourceId}/reception?category=&medical_program_id=&parent_group_id=&procedure_report=false&q=${searchParam}`)
        .send()
    ).body;
  }
}
