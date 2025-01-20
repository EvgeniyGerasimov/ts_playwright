import { MultipartFormData } from '../../models/multipartFormData.model';

export class DocumentsFormDataBuilder {
  private model: MultipartFormData;
  constructor(file: Buffer, fileName: string) {
    this.model = {
      'person.PASSPORT': {
        name: fileName,
        mimeType: 'image/png',
        buffer: file,
      },
    };
  }

  public build() {
    return this.model;
  }
}
