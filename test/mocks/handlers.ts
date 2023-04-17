import { rest } from 'msw';
import { tnaStandardResponse } from './tnaSearchMock';
import { orpStandardResponse } from './orpSearchMock';
import { mockedSearchLambda, mockedUrlLambda } from './config.mock';
import { tnaUkSecondaryLegislationDocumentMock } from './tnaDocumentsMock';

export const TNA_DOC_URL = 'http://www.legislation.gov.uk/id/something';

export const searchMock = jest.fn();
export const handlers = [
  rest.get('https://www.legislation.gov.uk/all/data.feed', (req, res, ctx) => {
    return res(ctx.status(200), ctx.xml(tnaStandardResponse));
  }),

  rest.get(
    'https://www.legislation.gov.uk/all/2000-2002/data.feed',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.xml(tnaStandardResponse));
    },
  ),

  rest.get(`${TNA_DOC_URL}/data.xml`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.xml(tnaUkSecondaryLegislationDocumentMock));
  }),

  rest.post(mockedSearchLambda, (req, res, ctx) => {
    searchMock(req.body);
    return res(ctx.status(200), ctx.json(orpStandardResponse));
  }),

  rest.post(mockedUrlLambda, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json('DONE'));
  }),
];
