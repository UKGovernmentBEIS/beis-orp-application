import { Test, TestingModule } from '@nestjs/testing';
import { TnaDal } from './tna.dal';
import { HttpModule } from '@nestjs/axios';
import { tnaStandardResponseJson } from '../../../test/mocks/tnaSearchMock';
import { rest } from 'msw';
import { server } from '../../../test/mocks/server';
import {
  tnaUkSecondaryLegislationDocumentMock,
  tnaUkSecondaryLegislationDocumentMockJson,
} from '../../../test/mocks/tnaDocumentsMock';

describe('TNA data access layer', () => {
  let tnaDal: TnaDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TnaDal],
      imports: [HttpModule],
    }).compile();

    tnaDal = module.get<TnaDal>(TnaDal);
  });

  describe('search', () => {
    it('should search the national archives and return as JS object', async () => {
      expect(
        await tnaDal.searchTna({ title: 'a', keyword: 'b' }),
      ).toMatchObject(tnaStandardResponseJson);
    });

    it('should include year ranges if supplied', async () => {
      expect(
        await tnaDal.searchTna({
          title: 'a',
          keyword: 'b',
          publishedToDate: '2002-01-13',
          publishedFromDate: '2000-03-13',
        }),
      ).toMatchObject(tnaStandardResponseJson);
    });
  });

  describe('getDocumentById', () => {
    it('requests xml data and converts to JS secondary legislation', async () => {
      server.use(
        rest.get('https://www.tna-id.com/data.xml', (req, res, ctx) => {
          return res(ctx.xml(tnaUkSecondaryLegislationDocumentMock));
        }),
      );

      const result = await tnaDal.getDocumentById('https://www.tna-id.com');

      expect(result).toEqual(tnaUkSecondaryLegislationDocumentMockJson);
    });
  });
});
