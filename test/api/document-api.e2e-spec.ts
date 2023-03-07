import { E2eFixture } from '../e2e.fixture';
import { getPdfBuffer } from '../mocks/uploadMocks';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { mockedSearchLambda } from '../mocks/config.mock';

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
describe('api/document/:id (GET)', () => {
  const fixture = new E2eFixture();
  beforeAll(async () => {
    await fixture.init();
  });

  beforeEach(async () => {
    jest.clearAllMocks();
    mockS3.send.mockResolvedValueOnce({ Body: getPdfBuffer() });
  });

  describe('validation', () => {
    it('returns bad request if id not supplied', async () => {
      return fixture.request().get('/api/document').send({}).expect(404);
    });

    it('is successful if id is provided', async () => {
      return fixture.request().get('/api/document/1').expect(200);
    });
  });

  describe('get document', () => {
    it('should call search and then get document with returned id', () => {
      return fixture
        .request()
        .get('/api/document/1')
        .expect(200)
        .expect((res) => {
          expect(mockS3.send).toBeCalledWith({
            getObjectCommand: true,
            Bucket: 'bucket',
            Key: 'doc.pdf',
          });
          expect(res.body).toBeInstanceOf(Buffer);
        });
    });

    it('should return a 404 if the orp search doesnt return a document', () => {
      server.use(
        rest.post(mockedSearchLambda, (req, res, ctx) => {
          return res(
            ctx.json({
              totalSearchResults: 0,
              documents: [],
            }),
          );
        }),
      );

      return fixture
        .request()
        .get('/api/document/1')
        .expect(404)
        .expect(
          '{"statusCode":404,"message":"Document not found","error":"Not Found"}',
        );
    });
  });
});
