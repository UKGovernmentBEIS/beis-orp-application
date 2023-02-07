import { E2eFixture } from '../e2e.fixture';
import { getPdfBuffer } from '../mocks/uploadMocks';

const mockS3 = {
  send: jest.fn(),
};

jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => mockS3),
    PutObjectCommand: jest.fn((args) => ({ ...args, putObjectCommand: true })),
    GetObjectCommand: jest.fn((args) => ({ ...args, getObjectCommand: true })),
  };
});
describe('api/upload (PUT)', () => {
  const fixture = new E2eFixture();
  let file: Buffer;

  beforeAll(async () => {
    file = await getPdfBuffer();
    await fixture.init();
  });

  afterAll(() => {
    fixture.tearDown();
  });

  it('accepts and uploads pdfs', async () => {
    mockS3.send.mockResolvedValueOnce('fake response');
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
});
