import { v4 as uuidv4 } from 'uuid';

export const regulators = [
  {
    name: 'public',
    domain: 'public.io',
    apiKey: uuidv4(),
  },
  {
    name: 'mxt',
    domain: 'mdrx.tech',
    apiKey: uuidv4(),
  },
];
