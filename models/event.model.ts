import { Encounter } from './encounter.model';

export interface EventModel {
  patient: string;
  resource: string;
  comment: string;
  dateBegin: string;
  dateEnd: string;
  eventState: string;
  eventPlaceId: string;
  reasonCreated: string;
  encounters: Encounter[];
}

export interface EventReason {
  icpc2Id: string;
  text: string;
}

export interface EventPeriod {
  periodStart: string;
  periodEnd: string;
}
