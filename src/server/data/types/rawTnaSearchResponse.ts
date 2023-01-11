interface RawTnaResponseLink {
  _attributes: { title?: string; href: string; type?: string; rel?: string };
}

interface RawTnaResponseEntry {
  title?: RawTitle;
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

interface LanguageTitle {
  div: {
    span: {
      _attributes: { 'xml:lang': string };
      _text: string;
    }[];
  };
}

export type RawTitle = { _text: string } | LanguageTitle;
export const isLanguageTitle = (title: RawTitle): title is LanguageTitle =>
  (title as LanguageTitle).div !== undefined;

export interface RawTnaResponse {
  feed: {
    'openSearch:totalResults': {
      _text: string;
    };
    entry: RawTnaResponseEntry | RawTnaResponseEntry[];
  };
}
