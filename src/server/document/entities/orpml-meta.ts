export interface OrpmlMeta {
  contributor?: string;

  coverage?: string;

  dates: {
    created?: string;
    modified?: string;
    coverageStartDate?: string;
    coverageEndDate?: string;
    archived?: string;
    uploaded?: string;
    issued?: string;
  };
  format?: string;
  identifier?: string;
  language?: string;
  languageName?: string;
  license?: string;
  publisher?: string;
  regulator?: string;
  regulatorId?: string;
  regulatoryTopic?: string;
  regulatoryTopics?: string[];
  status?: string;
  subject?: string;
  title?: string;
  type?: string;
  uri?: string;
  userId?: string;
}
