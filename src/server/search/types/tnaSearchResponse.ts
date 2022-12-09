interface RawTnaResponseLink {
  _attributes: { title: string; href: string; type: string };
}

interface RawTnaResponseEntry {
  title: { _text: string };
  author: { name: { _text: string } };
  updated: { _text: string };
  published: { _text: string };
  legislationType: {
    'ukm:DocumentMainType': { _attributes: { _text: string } };
  };
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
