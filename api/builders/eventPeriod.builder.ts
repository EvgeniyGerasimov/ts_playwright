import { EventPeriod } from '../../models/event.model';
import { getDateHelper } from '../../utils/helpers';

export class EventPeriodBuilder {
  private model: EventPeriod;
  constructor() {
    this.model = {
      periodStart: getDateHelper(-15, 'minutes'),
      periodEnd: getDateHelper(-2, 'minutes'),
    };
  }

  public build() {
    return this.model;
  }
}
