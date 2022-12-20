interface RawTnaResponseLink {
  _attributes: { title?: string; href: string; type?: string };
}

interface RawTnaResponseEntry {
  title?: { _text: string };
  author?: { name: { _text: string } };
  updated?: { _text: string };
  published?: { _text: string };
  creation?: { _text: string };
  'ukm:DocumentMainType'?: { _attributes?: { Value: string } };
  'ukm:Number'?: { _attributes?: { Value: string } };
  'ukm:Year'?: { _attributes?: { Value: string } };
  'ukm:CreationDate'?: { _attributes?: { Date: string } };
  link: RawTnaResponseLink | RawTnaResponseLink[];
}

export interface RawTnaResponse {
  feed: {
    'openSearch:totalResults': {
      _text: string;
    };
    entry: RawTnaResponseEntry | RawTnaResponseEntry[];
  };
}
