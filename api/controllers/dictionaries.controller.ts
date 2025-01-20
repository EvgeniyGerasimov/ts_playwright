import { BaseController } from './base.controller';
import { step } from '../../utils/step';

export class DictionariesController extends BaseController {
  @step('Get Ambulatory Service Locations')
  async getAmbulatoryServiceLocations(): Promise<any> {
    return (await this.request().url('/api/dictionaries/locations?context=Ambulatory').send()).body;
  }

  @step('Get icpc2 reason by name')
  async getReasonByName(name: string): Promise<any> {
    return (
      await this.request()
        .url(
          `/api/v2/dictionaries/icpc2?favoritesContext=reason&groupId=1&isActive=true&limit=7&page=1&search=${name}&skip=0`,
        )
        .send()
    ).body;
  }

  @step('Get icpc2 reason by name')
  async getActionByName(name: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/v2/dictionaries/icpc2?favoritesContext=action&groupId=1&isActive=true&limit=7&page=1&search=${name}&skip=0`)
        .send()
    ).body;
  }

  @step('Get Icpc2 diagnose by code')
  async getIcpc2DiagnoseByName(name: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/v2/dictionaries/icpc2?favoritesContext=diagnosis&groupId=2&isActive=true&limit=7&page=1&search=${name}&skip=0`)
        .send()
    ).body;
  }

  @step('Get Icd10 diagnose by code')
  async getIcd10amDiagnoseByName(searchParam: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/v2/dictionaries/icd10am?class=AMB&favoritesContext=diagnosis&isActive=true&limit=7&page=1&search=${searchParam}&skip=0`)
        .send()
    ).body;
  }

  @step('Get secret questions')
  async getSecretQuestions(): Promise<any> {
    return (
      await this.request()
        .url(`/api/dict/secretquestions`)
        .send()).body;
  }
}
