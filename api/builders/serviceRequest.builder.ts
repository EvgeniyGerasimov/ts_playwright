export class ServiceRequestBuilder {
  private model: any;
  constructor(
    procedureProgramId: string,
    procedureCategory: string,
    eHealthPersonId: string,
    episodeId: string,
    eHealthEncounterId: string,
    text: string,
    achiId: string,
  ) {
    this.model = {
      program_id: procedureProgramId,
      quantity: 1,
      unit_code: 'PIECE',
      category: procedureCategory,
      priority: 'routine',
      service: {
        value: achiId,
        type: 'service',
        text: text,
      },
      prequalify: false,
      type_occurrence: '',
      note: '',
      patient_instruction: '',
      patient_id: eHealthPersonId,
      episode_id: episodeId,
      encounter_id: eHealthEncounterId,
    };
  }

  public setServiceType(serviceType: string) {
    this.model.service.type = serviceType;
    return this;
  }

  public build() {
    return this.model;
  }
}
