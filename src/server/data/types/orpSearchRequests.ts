export type OrpSearchBody = {
  keyword?: string;
  title?: string;
  regulator_id?: string[];
  date_published?: string;
  regulatory_topic?: string;
  status?: string;
  document_type?: string[];
};

export type OrpIdSearchBody = {
  id: string;
};
