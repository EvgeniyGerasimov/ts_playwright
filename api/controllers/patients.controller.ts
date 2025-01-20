import { step } from '../../utils/step';
import { BaseController } from './base.controller';

export class PatientsController extends BaseController {
  @step('Create patient')
  async createPatient(data: any): Promise<any> {
    return (
      await this.request()
        .url('/api/patients')
        .body(data)
        .method('POST')
        .send()
    ).body;
  }

  @step('Fill in patient details')
  async fillInPatientDetails(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}`)
        .body(data).method('PUT')
        .send()
    ).body;
  }

  @step('Add phone info')
  async addPhoneInfo(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/phones`)
        .body(data).method('POST')
        .send()
    ).body;
  }

  @step('Setup authentication methods')
  async setupAuthMethods(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/authenticationMethods`)
        .body(data)
        .method('PUT')
        .send()
    ).body;
  }

  @step('Add Identity Documents')
  async addIdentityDocuments(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/identityDocuments`)
        .body(data)
        .method('POST')
        .send()
    ).body;
  }

  @step('Verify documents')
  async verifyDocuments(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/verification`)
        .body(data)
        .method('PUT')
        .send()
    ).body;
  }

  @step('Add address')
  async addAddress(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/addresses`)
        .body(data)
        .method('POST')
        .send()
    ).body;
  }

  @step('Add emergency contact')
  async addEmergencyContact(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/emergencycontact`)
        .body(data)
        .method('PUT')
        .send()
    ).body;
  }

  @step('Add secret question')
  async addSecretQuestion(patientId: string, data: any): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/secret`)
        .body(data).method('PUT')
        .send()
    ).body;
  }

  @step('Create person request')
  async createPersonRequest(patientId: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/personRequests`)
        .body({})
        .method('POST')
        .send()
    ).body;
  }

  @step('Add documents to person request')
  async addDocumentsToPersonRequest(patientId: string, personRequestId: string, form: any,): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/personRequests/${personRequestId}/documents`)
        .method('POST')
        .formData(form)
        .send()
    ).body;
  }

  @step('Approve person request')
  async approvePersonRequest(patientId: string, personRequestId: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/personRequests/${personRequestId}/approve`)
        .body({})
        .method('POST')
        .send()
    ).body;
  }

  @step('Get Sign Id')
  async getSignId(patientId: string, personRequestId: string): Promise<any> {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/personRequests/${personRequestId}/sign`)
        .send()
    ).body;
  }

  @step('Sign person request')
  async signPersonRequest(patientId: string, personRequestId: string, signId: string) {
    return (
      await this.request()
        .url(`/api/patients/${patientId}/personRequests/${personRequestId}/sign`)
        .method('POST')
        .body({ signId: signId })
        .send()
    ).body;
  }

  @step('Get patient by id')
  async getPatientById(patientId: string) {
    return (await this.request().url(`/api/patients/${patientId}`).send()).body;
  }

  @step('Search patient in e-health')
  async searchPatientInEHealth(firstName: string, lastName: string, birthDate: string) {
    return (
      await this.request()
        .url(`/api/ehealth/persons?birth_date=${birthDate}&first_name=${firstName}&last_name=${lastName}`)
        .send()
    ).body;
  }
}
