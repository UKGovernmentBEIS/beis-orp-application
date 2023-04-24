import { E2eFixture } from '../e2e.fixture';
import { getPdfBuffer } from '../mocks/uploadMocks';
import { FULL_TOPIC_PATH } from '../mocks/topics';

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
    await fixture.init('API_REG');
  });

  it('accepts and uploads pdfs', async () => {
    mockS3.send.mockResolvedValueOnce('fake response');

    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.pdf')
      .field({
        status: 'draft',
        document_type: 'GD',
        topics: FULL_TOPIC_PATH.at(-1),
      })
      .expect(200)
      .expect('success');
  });

  it('returns error when no file provided', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', '')
      .field({
        status: 'draft',
        document_type: 'GD',
        topics: FULL_TOPIC_PATH.at(-1),
      })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":"File is required","error":"Bad Request"}',
      );
  });

  it('returns error when unsupported file provided', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.png')
      .field({
        status: 'draft',
        document_type: 'GD',
        topics: FULL_TOPIC_PATH.at(-1),
      })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":"The uploaded file must be a PDF, Microsoft Word or Open Office document","error":"Bad Request"}',
      );
  });

  it('returns error when wrong status provided', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.png')
      .field({
        status: 'wrong',
        document_type: 'GD',
        topics: FULL_TOPIC_PATH.at(-1),
      })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":["status must be one of the following values: draft, published"],"error":"Bad Request"}',
      );
  });

  it('returns error when document_type status provided', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.png')
      .field({
        status: 'published',
        document_type: 'wrong',
        topics: FULL_TOPIC_PATH.at(-1),
      })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":["document_type must be one of the following values: GD, MSI, HS, OTHER"],"error":"Bad Request"}',
      );
  });

  it('returns error when topics is not provided', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.png')
      .field({
        status: 'published',
        document_type: 'GD',
      })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":["Topic must be end of a complete topic branch"],"error":"Bad Request"}',
      );
  });

  it('returns error when topics is not end of a topic branch', async () => {
    return fixture
      .request()
      .put('/api/upload')
      .attach('file', file, 'testfile.png')
      .field({
        status: 'published',
        document_type: 'GD',
        topics: FULL_TOPIC_PATH.at(-2),
      })
      .expect(400)
      .expect(
        '{"statusCode":400,"message":["Topic must be end of a complete topic branch"],"error":"Bad Request"}',
      );
  });
});
