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

export const getPdfBuffer = (): Promise<Buffer> =>
  fileToBuffer(__dirname + '/test.pdf');

export const getPdfAsMulterFile = async (): Promise<Express.Multer.File> => {
  const buffer = await getPdfBuffer();
  const readableStreamBuffer = Readable.from(buffer);

  return {
    buffer,
    fieldname: 'fieldname-defined-in-@UseInterceptors-decorator',
    originalname: 'original-filename',
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
