import { E2eFixture } from '../e2e.fixture';
import { getPdfBuffer } from '../mocks/uploadMocks';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { mockedSearchLambda } from '../mocks/config.mock';

const mockS3 = {
  getObject: jest.fn().mockReturnThis(),
  createReadStream: jest.fn(),
};

jest.mock('aws-sdk', () => {
  return { S3: jest.fn(() => mockS3) };
});

describe('api/document/:id (GET)', () => {
  const fixture = new E2eFixture();

  beforeEach(async () => {
    await fixture.init();
    jest.clearAllMocks();
    mockS3.createReadStream.mockResolvedValueOnce(getPdfBuffer());
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
          expect(mockS3.getObject).toBeCalledWith({
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
