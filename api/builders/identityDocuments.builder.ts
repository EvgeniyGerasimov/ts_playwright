import { generateRandomNumber } from '../../utils/testDataGenerator';
import { getDateHelper } from '../../utils/helpers';

export class IdentityDocumentsBuilder {
  private model: any;
  constructor() {
    this.model = {
      documentType: 'identityId_21',
      issuedBy: 'Держава',
      issueDate: getDateHelper(-1, 'years'),
      documentSeries: 'МВ',
      documentSerialNumber: generateRandomNumber(6),
    };
  }

  public build() {
    return this.model;
  }
}
