import { RequestHolder } from './requestHolder';
import { DictionariesController } from './controllers/dictionaries.controller';
import { AuthController } from './controllers/auth.controller';
import { EventController } from './controllers/event.controller';
import { DepositSignController } from './controllers/depositSign.controller';
import { DisRestDictionaryController } from './controllers/disRestDictionary.controller';
import { PatientsController } from './controllers/patients.controller';
import { EncounterController } from './controllers/encounter.controller';
import { ServiceRequestController } from './controllers/serviceRequest.controller';
import { DisRestSignerController } from './controllers/disRestSigner.controller';

export class API extends RequestHolder {
  public readonly dictionary = new DictionariesController(this.request);
  public readonly auth = new AuthController(this.request);
  public readonly event = new EventController(this.request);
  public readonly depositSign = new DepositSignController(this.request);
  public readonly disRestDictionary = new DisRestDictionaryController(this.request);
  public readonly patient = new PatientsController(this.request);
  public readonly encounter = new EncounterController(this.request);
  public readonly appointment = new ServiceRequestController(this.request);
  public readonly disRestSigner = new DisRestSignerController(this.request);
}
