export type UserCollectedUrlUploadData = {
  uri: string;
  document_type: string;
  status: string;
  topics: string;
};

export type UrlUpload = UserCollectedUrlUploadData & {
  regulator_id: string;
  user_id: string;
  uuid: string;
};
