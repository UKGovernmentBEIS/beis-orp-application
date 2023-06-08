export const documentTypes = {
  GD: 'Guidance',
  MSI: 'Market data, Standards and Information',
  HS: 'Horizon Scanning',
} as const;

export type DocumentType = keyof typeof documentTypes;
