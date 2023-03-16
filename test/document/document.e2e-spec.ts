import { E2eFixture } from '../e2e.fixture';
import { TNA_DOC_URL } from '../mocks/handlers';
import { server } from '../mocks/server';
import { rest } from 'msw';
import { mockedSearchLambda } from '../mocks/config.mock';
import { getRawOrpDocument } from '../mocks/orpSearchMock';
import * as cheerio from 'cheerio';

const mockUrl = 'http://document';

const mockS3 = {
  send: jest.fn(),
};
jest.mock('@aws-sdk/client-s3', () => {
  return {
    S3Client: jest.fn(() => mockS3),
    GetObjectCommand: jest.fn((args) => ({ ...args, getObjectCommand: true })),
    HeadObjectCommand: jest.fn((args) => ({
      ...args,
      headObjectCommand: true,
    })),
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

  describe('document/view/:id (GET)', () => {
    it('should get document and display in object if pdf', () => {
      mockS3.send.mockResolvedValueOnce({
        MetaData: {},
        ContentType: 'application/pdf',
      });

      return fixture
        .request()
        .get('/document/view/1')
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('h1').text().trim()).toEqual('Title1');
          expect($('object.embedded-pdf').length).toBeTruthy();
          expect(
            $('embed[src="http://document"][type="application/pdf"]').length,
          ).toBeTruthy();
        });
    });

    it('should get document and display in iframe if .docx', () => {
      mockS3.send.mockResolvedValueOnce({
        MetaData: {},
        ContentType:
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      });

      return fixture
        .request()
        .get('/document/view/1')
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('h1').text().trim()).toEqual('Title1');
          expect($('object.embedded-pdf').length).toBeFalsy();
          expect(
            $(
              'iframe[src="https://docs.google.com/gview?url=http%3A%2F%2Fdocument&embedded=true"]',
            ).length,
          ).toBeTruthy();
        });
    });

    it('should get document and display in iframe if .doc', () => {
      mockS3.send.mockResolvedValueOnce({
        MetaData: {},
        ContentType: 'application/msword',
      });

      return fixture
        .request()
        .get('/document/view/1')
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('h1').text().trim()).toEqual('Title1');
          expect($('object.embedded-pdf').length).toBeFalsy();
          expect(
            $(
              'iframe[src="https://docs.google.com/gview?url=http%3A%2F%2Fdocument&embedded=true"]',
            ).length,
          ).toBeTruthy();
        });
    });

    it('should not get document if non-displayable mimetype', () => {
      mockS3.send.mockResolvedValueOnce({
        MetaData: {},
        ContentType: 'application/vnd.oasis.opendocument.text',
      });

      return fixture
        .request()
        .get('/document/view/1')
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('h1').text().trim()).toEqual('Title1');
          expect($('object').length).toBeFalsy();
          expect($('iframe').length).toBeFalsy();
        });
    });
  });

  describe('document/linked-documents?href=id (GET)', () => {
    it('should get linked documents', () => {
      const searchResp = {
        documents: [
          {
            legislation_href: 'href',
            related_docs: [getRawOrpDocument()],
          },
        ],
        total_search_results: 1,
      };

      server.use(
        rest.post(mockedSearchLambda, (req, res, ctx) => {
          return res(ctx.json(searchResp));
        }),
      );

      return fixture
        .request()
        .get(`/document/linked-documents?id=${TNA_DOC_URL}`)
        .expect(200)
        .expect((res) => {
          const $ = cheerio.load(res.text);
          expect($('h1').text().trim()).toEqual('UK Doc Title');
          expect($('a[href="/document/view/0001"]>h3').text().trim()).toEqual(
            'Title',
          );
        });
    });
  });
});
