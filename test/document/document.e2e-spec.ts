import { E2eFixture } from '../e2e.fixture';

const mockUrl = 'http://document';
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(),
    GetObjectCommand: jest.fn((args) => ({ ...args, getObjectCommand: true })),
  };
});

jest.mock('@aws-sdk/s3-request-presigner', () => {
  return {
    getSignedUrl: () => mockUrl,
  };
});

describe('DocumentController (e2e)', () => {
  const fixture = new E2eFixture();

  beforeAll(async () => {
    await fixture.init();
  });

  afterAll(() => {
    fixture.tearDown();
  });

  it('document/:id (GET)', () => {
    return fixture
      .request()
      .get('/document/1')
      .expect(200)
      .expect((res) => {
        expect(res.text).toContain('<h1 class="govuk-heading-l">Title1</h1>');
        expect(res.text).toContain(
          '<object class="embedded-pdf" data="http://document" type="application/pdf" >',
        );
        expect(res.text).toContain(
          '<embed src="http://document" type="application/pdf" />',
        );
        expect(res.text).toContain('<dd>Office of Communications</dd>');
      });
  });
});
