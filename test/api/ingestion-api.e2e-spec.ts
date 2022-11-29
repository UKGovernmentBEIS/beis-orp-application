import { E2eFixture } from '../e2e.fixture';
import { getPdfBuffer } from './mocks/uploadMocks';

const mockS3 = {
  putObject: jest.fn().mockReturnThis(),
  promise: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mockS3) };
});

describe('api/upload (PUT)', () => {
  const fixture = new E2eFixture();
  let file: Buffer;

  beforeAll(async () => {
    file = await getPdfBuffer();
  });

  beforeEach(async () => {
    await fixture.init();
  });

  it('accepts and uploads pdfs', async () => {
    mockS3.promise.mockResolvedValueOnce('fake response');
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.pdf')
      .expect(200)
      .expect('success');
  });

  it('returns error when no file provided', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', '')
      .expect(400)
      .expect(
        '{"statusCode":400,"message":"File is required","error":"Bad Request"}',
      );
  });

  it('returns error when non pdf file provided', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.png')
      .expect(400)
      .expect(
        '{"statusCode":400,"message":"Validation failed (expected type is pdf)","error":"Bad Request"}',
      );
  });

  it('returns error when aws upload fails', async () => {
    mockS3.promise.mockRejectedValue(new Error('upload fail'));
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.pdf')
      .expect(500)
      .expect(
        '{"statusCode":500,"message":"There was a problem uploading the document","error":"Internal Server Error"}',
      );
  });
});
