import * as fs from 'fs';
import { Readable } from 'stream';
import { AwsDal } from '../../src/server/data/aws.dal';

const fileToBuffer = (filename): Promise<Buffer> => {
  const readStream = fs.createReadStream(filename);
  const chunks = [];
  return new Promise((resolve, reject) => {
    readStream.on('error', (err) => {
      reject(err);
    });

    readStream.on('data', (chunk) => {
      chunks.push(chunk);
    });

    readStream.on('close', () => {
      resolve(Buffer.concat(chunks));
    });
  });
};

type FILES = 'PDF' | 'EMPTY_PDF' | 'DOCX' | 'EMPTY_DOCX' | 'ODT' | 'EMPTY_ODT';
const files: Record<FILES, string> = {
  PDF: 'test.pdf',
  EMPTY_PDF: 'test-empty.pdf',
  DOCX: 'test.docx',
  EMPTY_DOCX: 'test-empty.docx',
  ODT: 'test.odt',
  EMPTY_ODT: 'test-empty.odt',
};
export const getPdfBuffer = (type: FILES = 'PDF'): Promise<Buffer> =>
  fileToBuffer(`${__dirname}/${files[type]}`);

export const getPdfAsMulterFile = async (): Promise<Express.Multer.File> => {
  const buffer = await getPdfBuffer();
  const readableStreamBuffer = Readable.from(buffer);

  return {
    buffer,
    fieldname: 'fieldname-defined-in-@UseInterceptors-decorator',
    originalname: 'Original-Filename',
    encoding: '7bit',
    mimetype: 'pdf',
    destination: 'destination-path',
    filename: 'file-name',
    path: 'file-path',
    size: 955578,
    stream: readableStreamBuffer,
  };
};

export const mockAwsDal = {
  provide: AwsDal,
  useValue: {
    upload: jest.fn(),
  },
};
