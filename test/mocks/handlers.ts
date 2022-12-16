import { rest } from 'msw';
import { TNA_URL } from '../../src/server/data/tna.dal';
import { tnaStandardResponse } from './tnaSearchMock';
import { orpStandardResponse } from './orpSearchMock';
import { mockedSearchLambda } from './config.mock';

export const handlers = [
  rest.get(TNA_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.xml(tnaStandardResponse));
  }),

  rest.post(mockedSearchLambda, (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(orpStandardResponse));
  }),
];
