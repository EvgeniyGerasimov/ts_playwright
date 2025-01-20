import { getBirthDate, getDateHelper } from './helpers';
import { PatientData } from '../models/paitent.model';

export function randomString(length: number) {
  let result = '';
  const cyrillicCharacters = 'абвгґдеєжзиіїйклмнопрстуфхцчшщьюя';

  for (let i = 0; i < length; i++) {
    const randomInd = Math.floor(Math.random() * cyrillicCharacters.length);
    result += cyrillicCharacters.charAt(randomInd);
  }
  return result;
}

export function generateRandomNumber(length: number): string {
  if (length <= 0) {
    throw new Error('Length must be greater than 0.');
  }

  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;

  return Math.floor(min + Math.random() * (max - min + 1)).toString();
}

export function capitalizeFirstLetter(string: string): string {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function generateTestPatient(age: number = 30): PatientData {
  const firstName = capitalizeFirstLetter(randomString(10));
  const lastName = capitalizeFirstLetter(randomString(10));
  const middleName = 'Автотестович';
  const birthDate = getBirthDate(30, 'years');
  return { firstName, lastName, birthDate, middleName };
}
