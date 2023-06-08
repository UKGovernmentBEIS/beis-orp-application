import { TnaSearchResponse } from '../entities/search-response.dto';
import {
  isLanguageTitle,
  RawTitle,
  RawTnaResponse,
} from '../../data/entities/raw-tna-search-response';
import { getTnaDocType } from '../../document/utils/tna-document-type.config';

const MAX_ITEMS = 10;

const maybeNumber = (item: string | number) =>
  item ? Number(item) : undefined;
export function mapTnaSearchResponse(
  response: RawTnaResponse,
): TnaSearchResponse {
  function getTitle(rawTitle?: RawTitle): string | undefined {
    if (!rawTitle) return;
    if (isLanguageTitle(rawTitle)) {
      const english = rawTitle.div.span.find(
        ({ _attributes }) => _attributes['xml:lang'] === 'en',
      );
      return english?._text ?? rawTitle.div.span[0]._text;
    }

    return rawTitle._text;
  }

  return {
    documents: [response.feed.entry]
      .flat()
      .filter((item) => item)
      .slice(0, MAX_ITEMS)
      .map((entry) => ({
        id: entry.id?._text,
        title: getTitle(entry.title),
        author: entry.author?.name?._text,
        dates: {
          updated: entry.updated?._text,
          published: entry.published?._text,
        },
        legislationType: getTnaDocType(
          entry['ukm:DocumentMainType']?._attributes?.Value,
        ).legType,
        number: maybeNumber(entry['ukm:Number']?._attributes?.Value),
        year: maybeNumber(entry['ukm:Year']?._attributes?.Value),
      })),
    totalSearchResults: maybeNumber(
      response.feed['openSearch:totalResults']?._text,
    ),
  };
}
