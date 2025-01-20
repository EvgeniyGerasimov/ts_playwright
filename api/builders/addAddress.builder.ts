import { generateRandomNumber } from '../../utils/testDataGenerator';

export class AddAddressBuilder {
  private model: any;
  constructor() {
    this.model = {
      addressIdAPI: 18101896,
      addressText: 'місто Київ, вул. Теремківська, 2',
      addressType: ['addressTypeId_1', 'addressTypeId_2', 'addressTypeId_3'],
      apartment: generateRandomNumber(4),
      typeEntity: 'PATIENT',
    };
  }

  public build() {
    return this.model;
  }
}
