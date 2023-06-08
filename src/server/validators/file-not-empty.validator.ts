import { FileValidator } from '@nestjs/common';
import {
  ooMimeType,
  pdfMimeType,
  wordMimeType,
} from '../document/utils/mime-types';
import * as pdf from 'pdf-parse';
import * as mammoth from 'mammoth';
import * as unzipper from 'unzipper';
import * as xml2js from 'xml2js';

export default class FileNotEmptyValidator extends FileValidator {
  buildErrorMessage() {
    return 'File must not be empty';
  }
  async isValid(file: Express.Multer.File) {
    if (file.mimetype === pdfMimeType) {
      const data = await pdf(file.buffer);
      return data.text.trim().length > 0;
    }

    if (file.mimetype === wordMimeType) {
      const text = await mammoth.extractRawText({ buffer: file.buffer });
      return text.value.trim().length > 0;
    }

    if (file.mimetype === ooMimeType) {
      const text = await unzipper.Open.buffer(file.buffer);

      const contentXml = await text.files
        .find((file) => file.path === 'content.xml')
        .buffer();
      const parser = new xml2js.Parser();
      const xmlString = contentXml.toString();

      const parsed = await parser.parseStringPromise(xmlString);
      return !!parsed['office:document-content']['office:body'][0][
        'office:text'
      ][0]['text:p'].find((item) => item['_'] && item['_'].length > 0);
    }

    return true;
  }
}
