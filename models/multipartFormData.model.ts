import { ReadStream } from 'fs';

export interface FileDetails {
  name: string;
  mimeType: string;
  buffer: Buffer;
}

export interface MultipartFormData {
  [key: string]: string | number | boolean | ReadStream | FileDetails;
}
