export const documentStatus = {
  active: 'Active',
  draft: 'Draft',
} as const;

export const orpDocumentStatus = {
  published: 'Active',
  draft: 'Draft',
};

export type DocumentStatus = keyof typeof documentStatus;
export type OrpDocumentStatus = keyof typeof orpDocumentStatus;
