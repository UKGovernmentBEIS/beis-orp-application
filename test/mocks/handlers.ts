import { rest } from 'msw';
import { TNA_URL } from '../../src/server/search/tna.dal';
import { tnaStandardResponse } from './tnaSearchMock';

export const handlers = [
  rest.get(TNA_URL, (req, res, ctx) => {
    return res(ctx.status(200), ctx.xml(tnaStandardResponse));
  }),
];
