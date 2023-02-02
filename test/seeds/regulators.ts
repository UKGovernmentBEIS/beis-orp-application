export const REGULATOR_UUID = '9d49ea3e-67d5-4985-90b0-e184ddc59d05';
const REGULATOR_2_UUID = '6a7a4ee1-fd7e-4e44-a3cb-1f2e9a71194e';

export const regulators = [
  {
    id: 'reg1',
    name: 'Regulator',
    domain: 'regulator.com',
    apiKey: REGULATOR_UUID,
  },
  {
    id: 'reg2',
    name: 'Regulator 2',
    domain: 'regulator2.tech',
    apiKey: REGULATOR_2_UUID,
  },
];

export const users = [
  {
    email: 'reg@regulator.com',
    domain: 'regulator.com',
  },
  {
    email: 'noreg@email.com',
    domain: null,
  },
  {
    email: 'todelete@email.com',
    domain: null,
  },
];
