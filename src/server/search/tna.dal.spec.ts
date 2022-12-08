import { Test, TestingModule } from '@nestjs/testing';
import { TNA_URL, TnaDal } from './tna.dal';
import { HttpModule } from '@nestjs/axios';
import { expectedOutputForTnaStandardResponse } from '../../../test/mocks/tnaSearchMock';
import { rest } from 'msw';
import { server } from '../../../test/mocks/server';

describe('TNA data access layer', () => {
  let tnaDal: TnaDal;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TnaDal],
      imports: [HttpModule],
    }).compile();

    tnaDal = module.get<TnaDal>(TnaDal);
  });

  it('should search the national archives and map to JS object with top 10 entries', async () => {
    expect(await tnaDal.searchTna('a', 'b')).toMatchObject(
      expectedOutputForTnaStandardResponse,
    );
  });

  it('should handle response with no entries', async () => {
    server.use(
      rest.get(TNA_URL, (req, res, ctx) => {
        return res(
          ctx.xml(`
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <openSearch:totalResults>8</openSearch:totalResults>
          </feed>
        `),
        );
      }),
    );

    expect(await tnaDal.searchTna('a', 'b')).toMatchObject({
      totalItems: 8,
      items: [],
    });
  });

  it('should handle response with no total', async () => {
    server.use(
      rest.get(TNA_URL, (req, res, ctx) => {
        return res(
          ctx.xml(`
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
              <ukm:DocumentMainType Value="LEGISLATION_TYPE"/>
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
              <ukm:DocumentMainType Value="LEGISLATION_TYPE"/>
              <ukm:Year Value="2016"/>
              <ukm:Number Value="364"/>
              <ukm:CreationDate Date="2015-07-01"/>
              <summary>SUMMARY</summary>
            </entry>                
          </feed>
        `),
        );
      }),
    );

    expect(await tnaDal.searchTna('a', 'b')).toEqual({
      totalItems: undefined,
      items: [
        {
          title: 'TITLE',
          legislationType: 'LEGISLATION_TYPE',
          published: '2015-07-01T00:00:00Z',
          updated: '2022-01-24T12:54:49Z',
          author: 'NAME',
          links: [
            {
              href: 'HREF',
              title: 'TITLE',
              type: 'TYPE',
            },
            {
              href: 'HREF2',
              title: 'TITLE2',
              type: 'TYPE2',
            },
          ],
        },
        {
          title: 'TITLE2',
          legislationType: 'LEGISLATION_TYPE',
          published: '2015-07-01T00:00:00Z',
          updated: '2022-01-24T12:54:49Z',
          author: 'NAME',
          links: [
            {
              href: 'HREF',
              title: 'TITLE',
              type: 'TYPE',
            },
            {
              href: 'HREF2',
              title: 'TITLE2',
              type: 'TYPE2',
            },
          ],
        },
      ],
    });
  });

  it('should handle single entry and single link', async () => {
    server.use(
      rest.get(TNA_URL, (req, res, ctx) => {
        return res(
          ctx.xml(`
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <entry>
              <id>http://www.legislation.gov.uk/id/eur/2016/364</id>
              <title>TITLE</title>
              <link rel="http://purl.org/dc/terms/tableOfContents" type="TYPE" href="HREF" title="TITLE"/>     
              <author><name>NAME</name></author>
              <updated>2022-01-24T12:54:49Z</updated>
              <published>2015-07-01T00:00:00Z</published>
              <ukm:DocumentMainType Value="LEGISLATION_TYPE"/>
              <ukm:Year Value="2016"/>
              <ukm:Number Value="364"/>
              <ukm:CreationDate Date="2015-07-01"/>
              <summary>SUMMARY</summary>
            </entry>                  
          </feed>
        `),
        );
      }),
    );

    expect(await tnaDal.searchTna('a', 'b')).toEqual({
      totalItems: undefined,
      items: [
        {
          title: 'TITLE',
          legislationType: 'LEGISLATION_TYPE',
          published: '2015-07-01T00:00:00Z',
          updated: '2022-01-24T12:54:49Z',
          author: 'NAME',
          links: [
            {
              href: 'HREF',
              title: 'TITLE',
              type: 'TYPE',
            },
          ],
        },
      ],
    });
  });

  it('should handle no links', async () => {
    server.use(
      rest.get(TNA_URL, (req, res, ctx) => {
        return res(
          ctx.xml(`
          <?xml version="1.0" encoding="utf-8"?>
          <feed>
            <entry>
              <id>http://www.legislation.gov.uk/id/eur/2016/364</id>
              <title>TITLE</title>
              <author><name>NAME</name></author>
              <updated>2022-01-24T12:54:49Z</updated>
              <published>2015-07-01T00:00:00Z</published>
              <ukm:DocumentMainType Value="LEGISLATION_TYPE"/>
              <ukm:Year Value="2016"/>
              <ukm:Number Value="364"/>
              <ukm:CreationDate Date="2015-07-01"/>
              <summary>SUMMARY</summary>
            </entry>                  
          </feed>
        `),
        );
      }),
    );

    expect(await tnaDal.searchTna('a', 'b')).toEqual({
      totalItems: undefined,
      items: [
        {
          title: 'TITLE',
          legislationType: 'LEGISLATION_TYPE',
          published: '2015-07-01T00:00:00Z',
          updated: '2022-01-24T12:54:49Z',
          author: 'NAME',
          links: [],
        },
      ],
    });
  });
});
