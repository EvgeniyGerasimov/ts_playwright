import { PatientData } from './paitent.model';
import { Doctor } from './doctor.model';
import { DictionaryEntry } from './dictionary.model';
import { EpisodeTypeAPI } from './episode.model';
import { EncounterClassOptions } from './encounter';

export interface ReceptionFixtureOptions {
  doctor: Doctor;
  reason: DictionaryEntry;
  diagnose: DictionaryEntry;
  actionOrService: DictionaryEntry;
  encounterClass: EncounterClassOptions;
  episodeType?: EpisodeTypeAPI;
}

export interface PatientFixtureOptions extends PatientData {
  patientId: string;
}
