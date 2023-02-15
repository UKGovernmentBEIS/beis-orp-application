export const documentStatus = {
  active: 'active',
  draft: 'draft',
} as const;

export type DocumentStatus = keyof typeof documentStatus;
