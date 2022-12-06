import { server } from './mocks/server';

beforeAll(() => {
  server.listen({
    onUnhandledRequest: ({ method, url }) => {
      // don't error for unhandled supertest call
      if (!url.origin.startsWith('http://127.0.0.1:')) {
        throw new Error(`Unhandled ${method} request to ${url}`);
      }
    },
  });
});

afterEach(() => server.resetHandlers());
afterAll(() => server.close());
