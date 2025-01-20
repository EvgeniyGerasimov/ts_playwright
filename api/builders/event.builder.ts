import { EventModel } from '../../models/event.model';
import { getDateHelper } from '../../utils/helpers';

export class EventBuilder {
  private model: EventModel;
  constructor(patientId: string, resourceId: string, locationId: string) {
    this.model = {
      patient: `${patientId}`,
      resource: `${resourceId}`,
      comment: '',
      dateBegin: getDateHelper(),
      dateEnd: getDateHelper(15, 'minutes'),
      eventState: 'PROCESSING',
      eventPlaceId: '7eca5128-7b89-4ff9-9b20-9db017d419e5',
      reasonCreated: 'reasonAppealId_10',
      encounters: [
        {
          priority: 'routine',
          class: 'PHC',
          type: 'service_delivery_location',
          locationId: `${locationId}`,
        },
      ],
    };
  }

  public setEncounterClass(encounterClass: string) {
    this.model.encounters[0].class = encounterClass;
    return this;
  }

  public changeDefaultEventPlace(eventPlaceId: string) {
    this.model.eventPlaceId = eventPlaceId;
    return this;
  }

  public build() {
    return this.model;
  }
}
