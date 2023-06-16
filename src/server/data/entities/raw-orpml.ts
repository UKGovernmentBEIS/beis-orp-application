export interface RawOrpml {
  metadata: {
    dublinCore: {
      title?: { _text: string };
      subject?: { _text: string };
      created?: { _text?: string };
      modified?: { _text?: string };
      publisher?: { _text: string };
      format?: { _text: string };
      language?: { _text: string };
      license?: { _text: string };
      issued?: { _text: string };
      identifier?: { _text: string };
      contributor?: { _text: string };
      type?: { _text: string };
      coverage?: { _text?: string };
    };
    dcat: {
      timePeriodCoverageStartDate?: { _text?: string };
      timePeriodCoverageEndDate?: { _text?: string };
      dataArchived?: { _text?: string };
    };
    orp: {
      regulatorId?: { _text: string };
      userId?: { _text: string };
      status?: { _text: string };
      regulatoryTopic?: { _text: string };
      dateUploaded?: { _text: string };
      uri?: { _text: string };
    };
  };
}
