import {
  expectedInternalOutputForTnaStandardResponse,
  tnaStandardResponseJson,
} from '../../../../test/mocks/tnaSearchMock';
import { mapTnaSearchResponse } from './tna-search-mapper';
import * as convert from 'xml-js';

describe('TNA data access layer', () => {
  it('should map to JS object with top 10 entries', async () => {
    expect(mapTnaSearchResponse(tnaStandardResponseJson)).toEqual(
      expectedInternalOutputForTnaStandardResponse,
    );
  });

  it('should handle response with no entries', async () => {
    const tnaResponse = `
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <openSearch:totalResults>8</openSearch:totalResults>
          </feed>
        `;

    expect(
      mapTnaSearchResponse(
        JSON.parse(convert.xml2json(tnaResponse, { compact: true })),
      ),
    ).toEqual({
      totalSearchResults: 8,
      documents: [],
    });
  });

  it('should handle response with no total', async () => {
    const tnaResponse = `
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <entry>
              <id>http://www.legislation.gov.uk/id/eur/2016/364</id>
              <title>TITLE</title>
              <link rel="http://purl.org/dc/terms/tableOfContents" type="TYPE" href="HREF" title="TITLE"/>
              <link rel="http://purl.org/dc/terms/tableOfContents" type="TYPE2" href="HREF2" title="TITLE2"/>
              <author><name>NAME</name></author>
              <updated>2022-01-24T12:54:49Z</updated>
              <published>2015-07-01T00:00:00Z</published>
              <ukm:DocumentMainType Value="UnitedKingdomStatutoryInstrument"/>
              <ukm:Year Value="2016"/>
              <ukm:Number Value="364"/>
              <ukm:CreationDate Date="2015-07-01"/>
              <summary>SUMMARY</summary>
            </entry>           
            <entry>
              <id>http://www.legislation.gov.uk/id/eur/2016/364</id>
              <title>TITLE2</title>
              <link rel="http://purl.org/dc/terms/tableOfContents" type="TYPE" href="HREF" title="TITLE"/>
              <link rel="http://purl.org/dc/terms/tableOfContents" type="TYPE2" href="HREF2" title="TITLE2"/>
              <author><name>NAME</name></author>
              <updated>2022-01-24T12:54:49Z</updated>
              <published>2015-07-01T00:00:00Z</published>
              <ukm:DocumentMainType Value="UnitedKingdomStatutoryInstrument"/>
              <ukm:Year Value="2016"/>
              <ukm:Number Value="364"/>
              <ukm:CreationDate Date="2015-07-01"/>
              <summary>SUMMARY</summary>
            </entry>                
          </feed>
        `;

    expect(
      mapTnaSearchResponse(
        JSON.parse(convert.xml2json(tnaResponse, { compact: true })),
      ),
    ).toEqual({
      totalSearchResults: undefined,
      documents: [
        {
          title: 'TITLE',
          legislationType: 'Secondary',
          dates: {
            published: '2015-07-01T00:00:00Z',
            updated: '2022-01-24T12:54:49Z',
          },
          author: 'NAME',
          number: 364,
          year: 2016,
          id: 'http://www.legislation.gov.uk/id/eur/2016/364',
        },
        {
          id: 'http://www.legislation.gov.uk/id/eur/2016/364',
          title: 'TITLE2',
          legislationType: 'Secondary',
          dates: {
            published: '2015-07-01T00:00:00Z',
            updated: '2022-01-24T12:54:49Z',
          },
          author: 'NAME',
          number: 364,
          year: 2016,
        },
      ],
    });
  });

  it('should handle single entry and single link', async () => {
    const tnaResponse = `
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <entry>
              <id>http://www.legislation.gov.uk/id/eur/2016/364</id>
              <title>TITLE</title>
              <link rel="http://purl.org/dc/terms/tableOfContents" type="TYPE" href="HREF" title="TITLE"/>     
              <author><name>NAME</name></author>
              <updated>2022-01-24T12:54:49Z</updated>
              <published>2015-07-01T00:00:00Z</published>
              <ukm:DocumentMainType Value="EnglandPrivateOrPersonalAct"/>
              <ukm:Year Value="2016"/>
              <ukm:Number Value="364"/>
              <ukm:CreationDate Date="2015-07-01"/>
              <summary>SUMMARY</summary>
            </entry>                  
          </feed>
        `;

    expect(
      mapTnaSearchResponse(
        JSON.parse(convert.xml2json(tnaResponse, { compact: true })),
      ),
    ).toEqual({
      totalSearchResults: undefined,
      documents: [
        {
          id: 'http://www.legislation.gov.uk/id/eur/2016/364',
          title: 'TITLE',
          legislationType: 'Primary',
          dates: {
            published: '2015-07-01T00:00:00Z',
            updated: '2022-01-24T12:54:49Z',
          },
          author: 'NAME',
          number: 364,
          year: 2016,
        },
      ],
    });
  });

  it('should handle no links', async () => {
    const tnaResponse = `
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <entry>
              <id>http://www.legislation.gov.uk/id/eur/2016/364</id>
              <title>TITLE</title>
              <author><name>NAME</name></author>
              <updated>2022-01-24T12:54:49Z</updated>
              <published>2015-07-01T00:00:00Z</published>
              <ukm:DocumentMainType Value="EnglandPrivateOrPersonalAct"/>
              <ukm:Year Value="2016"/>
              <ukm:Number Value="364"/>
              <ukm:CreationDate Date="2015-07-01"/>
              <summary>SUMMARY</summary>
            </entry>                  
          </feed>
        `;

    expect(
      mapTnaSearchResponse(
        JSON.parse(convert.xml2json(tnaResponse, { compact: true })),
      ),
    ).toEqual({
      totalSearchResults: undefined,
      documents: [
        {
          id: 'http://www.legislation.gov.uk/id/eur/2016/364',
          title: 'TITLE',
          legislationType: 'Primary',
          dates: {
            published: '2015-07-01T00:00:00Z',
            updated: '2022-01-24T12:54:49Z',
          },
          author: 'NAME',
          number: 364,
          year: 2016,
        },
      ],
    });
  });

  it('should handle attributes not being present', async () => {
    const tnaResponse = `
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <entry>
       
            </entry>                  
          </feed>
        `;

    expect(
      mapTnaSearchResponse(
        JSON.parse(convert.xml2json(tnaResponse, { compact: true })),
      ),
    ).toEqual({
      totalSearchResults: undefined,
      documents: [
        {
          id: undefined,
          author: undefined,
          dates: {
            published: undefined,
            updated: undefined,
          },
          legislationType: undefined,
          number: undefined,
          title: undefined,
          year: undefined,
        },
      ],
    });
  });
});
