export class SignerAppointmentBuilder {
  private model: any;
  constructor(signerParams: any) {
    this.model = {
      status: 'active',
      intent: 'order',
      priority: 'routine',
      category: {
        coding: [
          {
            system: 'eHealth/SNOMED/service_request_categories',
            code: signerParams.category,
          },
        ],
      },
      code: {
        identifier: {
          type: {
            coding: [
              {
                system: 'eHealth/resources',
                code: 'service',
              },
            ],
          },
          value: signerParams.achiId,
        },
      },
      context: {
        identifier: {
          type: {
            coding: [
              {
                system: 'eHealth/resources',
                code: 'encounter',
              },
            ],
          },
          value: signerParams.eHealthEncounterId,
        },
      },
      requester_employee: {
        identifier: {
          type: {
            coding: [
              {
                system: 'eHealth/resources',
                code: 'employee',
              },
            ],
          },
          value: signerParams.eHealthEmployeeId,
        },
      },
      requester_legal_entity: {
        identifier: {
          type: {
            coding: [
              {
                system: 'eHealth/resources',
                code: 'legal_entity',
              },
            ],
          },
          value: signerParams.eHealthLegalEntityId,
        },
      },
      reason_reference: [
        {
          identifier: {
            type: {
              coding: [
                {
                  system: 'eHealth/resources',
                  code: 'condition',
                },
              ],
            },
            value: signerParams.eHealthConditionId,
          },
        },
      ],
      permitted_resources: [
        {
          identifier: {
            type: {
              coding: [
                {
                  system: 'eHealth/resources',
                  code: 'episode_of_care',
                },
              ],
            },
            value: signerParams.eHealthEpisodeId,
          },
        },
      ],
      quantity: {
        value: 1,
        system: 'SERVICE_UNIT',
        code: 'PIECE',
      },
      id: signerParams.appointmentId,
      program: {
        identifier: {
          type: {
            coding: [
              {
                system: 'eHealth/resources',
                code: 'medical_program',
              },
            ],
          },
          value: signerParams.eHealthProgramId,
        },
      },
    };
  }

  public build() {
    return this.model;
  }
}
