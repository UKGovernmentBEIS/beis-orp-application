export const documentStatus = {
  active: 'Active',
  draft: 'Draft',
} as const;

export type DocumentStatus = keyof typeof documentStatus;
