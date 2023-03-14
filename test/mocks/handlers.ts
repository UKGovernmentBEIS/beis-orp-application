import { rest } from 'msw';
import { TNA_URL } from '../../src/server/data/tna.dal';
import { tnaStandardResponse } from './tnaSearchMock';
import { orpStandardResponse } from './orpSearchMock';
import { mockedSearchLambda } from './config.mock';
import { tnaUkSecondaryLegislationDocumentMock } from './tnaDocumentsMock';

export const TNA_DOC_URL = 'https://tna.com/id/something';

export const searchMock = jest.fn();
export const handlers = [
  rest.get(TNA_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.xml(tnaStandardResponse));
  }),

  rest.get(`${TNA_DOC_URL}/data.xml`, (req, res, ctx) => {
    return res(ctx.status(200), ctx.xml(tnaUkSecondaryLegislationDocumentMock));
  }),

  rest.post(mockedSearchLambda, (req, res, ctx) => {
    searchMock(req.body);
    return res(ctx.status(200), ctx.json(orpStandardResponse));
  }),
];
