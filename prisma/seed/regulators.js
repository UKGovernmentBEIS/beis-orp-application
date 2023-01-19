/* eslint-disable @typescript-eslint/no-var-requires */
const { v4 } = require('uuid');

exports.regulators = [
  {
    name: 'public',
    domain: 'public.io',
    apiKey: v4(),
  },
  {
    name: 'mxt',
    domain: 'mdrx.tech',
    apiKey: v4(),
  },
];
