import { ApiSearchResponseDto } from '../../src/server/api/types/ApiSearchResponse.dto';
import { SearchResponseDto } from '../../src/server/search/types/SearchResponse.dto';
import * as snakecaseKeys from 'snakecase-keys';

export const tnaStandardResponse = `
<?xml version="1.0" encoding="utf-8"?><feed xmlns="http://www.w3.org/2005/Atom" xmlns:leg="http://www.legislation.gov.uk/namespaces/legislation" xmlns:ukm="http://www.legislation.gov.uk/namespaces/metadata" xmlns:theme="http://www.legislation.gov.uk/namespaces/theme" xmlns:openSearch="http://a9.com/-/spec/opensearch/1.1/" xmlns:parameters="http://a9.com/-/spec/opensearch/extensions/parameters/1.0/">
    <id>http://www.legislation.gov.uk/title/construction/data.feed</id>
    <link rel="self" type="application/atom+xml" href="http://www.legislation.gov.uk/title/construction/data.feed"/>
    <updated>2022-12-05T16:45:24.71102Z</updated>
    <title>Search Results</title>
    <openSearch:Query role="request" leg:type="all" leg:title="construction"> </openSearch:Query>
    <openSearch:itemsPerPage>20</openSearch:itemsPerPage>
    <openSearch:startIndex>1</openSearch:startIndex>
    <openSearch:totalResults>20</openSearch:totalResults>
    <leg:page>1</leg:page>
    <leg:morePages>12</leg:morePages>
    <leg:facets>

        <leg:facetTypes><leg:facetType type="UnitedKingdomStatutoryInstrument" href="http://www.legislation.gov.uk/search/data.feed?type=uksi&amp;title=construction" value="436"/><leg:facetType type="NorthernIrelandStatutoryRule" href="http://www.legislation.gov.uk/search/data.feed?type=nisr&amp;title=construction" value="157"/><leg:facetType type="EuropeanUnionDecision" href="http://www.legislation.gov.uk/search/data.feed?type=eudn&amp;title=construction" value="141"/><leg:facetType type="NorthernIrelandStatutoryRuleOrOrder" href="http://www.legislation.gov.uk/search/data.feed?type=nisro&amp;title=construction" value="71"/><leg:facetType type="EuropeanUnionRegulation" href="http://www.legislation.gov.uk/search/data.feed?type=eur&amp;title=construction" value="57"/><leg:facetType type="EuropeanUnionDirective" href="http://www.legislation.gov.uk/search/data.feed?type=eudr&amp;title=construction" value="10"/><leg:facetType type="WelshStatutoryInstrument" href="http://www.legislation.gov.uk/search/data.feed?type=wsi&amp;title=construction" value="9"/><leg:facetType type="ScottishStatutoryInstrument" href="http://www.legislation.gov.uk/search/data.feed?type=ssi&amp;title=construction" value="7"/><leg:facetType type="UnitedKingdomLocalAct" href="http://www.legislation.gov.uk/search/data.feed?type=ukla&amp;title=construction" value="2"/><leg:facetType type="UnitedKingdomPublicGeneralAct" href="http://www.legislation.gov.uk/search/data.feed?type=ukpga&amp;title=construction" value="2"/><leg:facetType type="NorthernIrelandAct" href="http://www.legislation.gov.uk/search/data.feed?type=nia&amp;title=construction" value="1"/><leg:facetType type="NorthernIrelandOrderInCouncil" href="http://www.legislation.gov.uk/search/data.feed?type=nisi&amp;title=construction" value="1"/><leg:facetType type="UnitedKingdomPrivateOrPersonalAct" href="http://www.legislation.gov.uk/search/data.feed?type=ukppa&amp;title=construction" value="1"/><leg:facetType type="UnitedKingdomStatutoryRuleOrOrder" href="http://www.legislation.gov.uk/search/data.feed?type=uksro&amp;title=construction" value="1"/></leg:facetTypes>
        <leg:facetYears><leg:facetYear year="2022" href="http://www.legislation.gov.uk/search/data.feed?year=2022&amp;title=construction" total="9"/><leg:facetYear year="2021" href="http://www.legislation.gov.uk/search/data.feed?year=2021&amp;title=construction" total="4"/><leg:facetYear year="2020" href="http://www.legislation.gov.uk/search/data.feed?year=2020&amp;title=construction" total="10"/><leg:facetYear year="2019" href="http://www.legislation.gov.uk/search/data.feed?year=2019&amp;title=construction" total="8"/><leg:facetYear year="2018" href="http://www.legislation.gov.uk/search/data.feed?year=2018&amp;title=construction" total="10"/><leg:facetYear year="2017" href="http://www.legislation.gov.uk/search/data.feed?year=2017&amp;title=construction" total="10"/><leg:facetYear year="2016" href="http://www.legislation.gov.uk/search/data.feed?year=2016&amp;title=construction" total="9"/><leg:facetYear year="2015" href="http://www.legislation.gov.uk/search/data.feed?year=2015&amp;title=construction" total="11"/><leg:facetYear year="2014" href="http://www.legislation.gov.uk/search/data.feed?year=2014&amp;title=construction" total="15"/><leg:facetYear year="2013" href="http://www.legislation.gov.uk/search/data.feed?year=2013&amp;title=construction" total="7"/><leg:facetYear year="2012" href="http://www.legislation.gov.uk/search/data.feed?year=2012&amp;title=construction" total="16"/><leg:facetYear year="2011" href="http://www.legislation.gov.uk/search/data.feed?year=2011&amp;title=construction" total="30"/><leg:facetYear year="2010" href="http://www.legislation.gov.uk/search/data.feed?year=2010&amp;title=construction" total="20"/><leg:facetYear year="2009" href="http://www.legislation.gov.uk/search/data.feed?year=2009&amp;title=construction" total="13"/><leg:facetYear year="2008" href="http://www.legislation.gov.uk/search/data.feed?year=2008&amp;title=construction" total="7"/><leg:facetYear year="2007" href="http://www.legislation.gov.uk/search/data.feed?year=2007&amp;title=construction" total="16"/><leg:facetYear year="2006" href="http://www.legislation.gov.uk/search/data.feed?year=2006&amp;title=construction" total="16"/><leg:facetYear year="2005" href="http://www.legislation.gov.uk/search/data.feed?year=2005&amp;title=construction" total="17"/><leg:facetYear year="2004" href="http://www.legislation.gov.uk/search/data.feed?year=2004&amp;title=construction" total="12"/><leg:facetYear year="2003" href="http://www.legislation.gov.uk/search/data.feed?year=2003&amp;title=construction" total="25"/><leg:facetYear year="2002" href="http://www.legislation.gov.uk/search/data.feed?year=2002&amp;title=construction" total="21"/><leg:facetYear year="2001" href="http://www.legislation.gov.uk/search/data.feed?year=2001&amp;title=construction" total="17"/><leg:facetYear year="2000" href="http://www.legislation.gov.uk/search/data.feed?year=2000&amp;title=construction" total="19"/><leg:facetYear year="1999" href="http://www.legislation.gov.uk/search/data.feed?year=1999&amp;title=construction" total="34"/><leg:facetYear year="1998" href="http://www.legislation.gov.uk/search/data.feed?year=1998&amp;title=construction" total="35"/><leg:facetYear year="1997" href="http://www.legislation.gov.uk/search/data.feed?year=1997&amp;title=construction" total="32"/><leg:facetYear year="1996" href="http://www.legislation.gov.uk/search/data.feed?year=1996&amp;title=construction" total="28"/><leg:facetYear year="1995" href="http://www.legislation.gov.uk/search/data.feed?year=1995&amp;title=construction" total="20"/><leg:facetYear year="1994" href="http://www.legislation.gov.uk/search/data.feed?year=1994&amp;title=construction" total="27"/><leg:facetYear year="1993" href="http://www.legislation.gov.uk/search/data.feed?year=1993&amp;title=construction" total="15"/><leg:facetYear year="1992" href="http://www.legislation.gov.uk/search/data.feed?year=1992&amp;title=construction" total="26"/><leg:facetYear year="1991" href="http://www.legislation.gov.uk/search/data.feed?year=1991&amp;title=construction" total="14"/><leg:facetYear year="1990" href="http://www.legislation.gov.uk/search/data.feed?year=1990&amp;title=construction" total="16"/><leg:facetYear year="1989" href="http://www.legislation.gov.uk/search/data.feed?year=1989&amp;title=construction" total="15"/><leg:facetYear year="1988" href="http://www.legislation.gov.uk/search/data.feed?year=1988&amp;title=construction" total="18"/><leg:facetYear year="1987" href="http://www.legislation.gov.uk/search/data.feed?year=1987&amp;title=construction" total="12"/><leg:facetYear year="1986" href="http://www.legislation.gov.uk/search/data.feed?year=1986&amp;title=construction" total="11"/><leg:facetYear year="1985" href="http://www.legislation.gov.uk/search/data.feed?year=1985&amp;title=construction" total="17"/><leg:facetYear year="1984" href="http://www.legislation.gov.uk/search/data.feed?year=1984&amp;title=construction" total="24"/><leg:facetYear year="1983" href="http://www.legislation.gov.uk/search/data.feed?year=1983&amp;title=construction" total="10"/><leg:facetYear year="1982" href="http://www.legislation.gov.uk/search/data.feed?year=1982&amp;title=construction" total="15"/><leg:facetYear year="1981" href="http://www.legislation.gov.uk/search/data.feed?year=1981&amp;title=construction" total="15"/><leg:facetYear year="1980" href="http://www.legislation.gov.uk/search/data.feed?year=1980&amp;title=construction" total="16"/><leg:facetYear year="1979" href="http://www.legislation.gov.uk/search/data.feed?year=1979&amp;title=construction" total="8"/><leg:facetYear year="1978" href="http://www.legislation.gov.uk/search/data.feed?year=1978&amp;title=construction" total="11"/><leg:facetYear year="1977" href="http://www.legislation.gov.uk/search/data.feed?year=1977&amp;title=construction" total="12"/><leg:facetYear year="1976" href="http://www.legislation.gov.uk/search/data.feed?year=1976&amp;title=construction" total="10"/><leg:facetYear year="1975" href="http://www.legislation.gov.uk/search/data.feed?year=1975&amp;title=construction" total="16"/><leg:facetYear year="1974" href="http://www.legislation.gov.uk/search/data.feed?year=1974&amp;title=construction" total="10"/><leg:facetYear year="1973" href="http://www.legislation.gov.uk/search/data.feed?year=1973&amp;title=construction" total="11"/><leg:facetYear year="1972" href="http://www.legislation.gov.uk/search/data.feed?year=1972&amp;title=construction" total="11"/><leg:facetYear year="1971" href="http://www.legislation.gov.uk/search/data.feed?year=1971&amp;title=construction" total="2"/><leg:facetYear year="1970" href="http://www.legislation.gov.uk/search/data.feed?year=1970&amp;title=construction" total="3"/><leg:facetYear year="1969" href="http://www.legislation.gov.uk/search/data.feed?year=1969&amp;title=construction" total="3"/><leg:facetYear year="1968" href="http://www.legislation.gov.uk/search/data.feed?year=1968&amp;title=construction" total="5"/><leg:facetYear year="1967" href="http://www.legislation.gov.uk/search/data.feed?year=1967&amp;title=construction" total="6"/><leg:facetYear year="1966" href="http://www.legislation.gov.uk/search/data.feed?year=1966&amp;title=construction" total="6"/><leg:facetYear year="1965" href="http://www.legislation.gov.uk/search/data.feed?year=1965&amp;title=construction" total="2"/><leg:facetYear year="1964" href="http://www.legislation.gov.uk/search/data.feed?year=1964&amp;title=construction" total="4"/><leg:facetYear year="1963" href="http://www.legislation.gov.uk/search/data.feed?year=1963&amp;title=construction" total="7"/><leg:facetYear year="1962" href="http://www.legislation.gov.uk/search/data.feed?year=1962&amp;title=construction" total="5"/><leg:facetYear year="1961" href="http://www.legislation.gov.uk/search/data.feed?year=1961&amp;title=construction" total="1"/><leg:facetYear year="1960" href="http://www.legislation.gov.uk/search/data.feed?year=1960&amp;title=construction" total="4"/><leg:facetYear year="1959" href="http://www.legislation.gov.uk/search/data.feed?year=1959&amp;title=construction" total="1"/><leg:facetYear year="1958" href="http://www.legislation.gov.uk/search/data.feed?year=1958&amp;title=construction" total="2"/><leg:facetYear year="1957" href="http://www.legislation.gov.uk/search/data.feed?year=1957&amp;title=construction" total="2"/><leg:facetYear year="1956" href="http://www.legislation.gov.uk/search/data.feed?year=1956&amp;title=construction" total="3"/><leg:facetYear year="1955" href="http://www.legislation.gov.uk/search/data.feed?year=1955&amp;title=construction" total="1"/><leg:facetYear year="1953" href="http://www.legislation.gov.uk/search/data.feed?year=1953&amp;title=construction" total="1"/><leg:facetYear year="1951" href="http://www.legislation.gov.uk/search/data.feed?year=1951&amp;title=construction" total="3"/><leg:facetYear year="1950" href="http://www.legislation.gov.uk/search/data.feed?year=1950&amp;title=construction" total="1"/><leg:facetYear year="1949" href="http://www.legislation.gov.uk/search/data.feed?year=1949&amp;title=construction" total="2"/><leg:facetYear year="1948" href="http://www.legislation.gov.uk/search/data.feed?year=1948&amp;title=construction" total="1"/><leg:facetYear year="1947" href="http://www.legislation.gov.uk/search/data.feed?year=1947&amp;title=construction" total="1"/><leg:facetYear year="1946" href="http://www.legislation.gov.uk/search/data.feed?year=1946&amp;title=construction" total="1"/><leg:facetYear year="1945" href="http://www.legislation.gov.uk/search/data.feed?year=1945&amp;title=construction" total="1"/><leg:facetYear year="1944" href="http://www.legislation.gov.uk/search/data.feed?year=1944&amp;title=construction" total="1"/><leg:facetYear year="1943" href="http://www.legislation.gov.uk/search/data.feed?year=1943&amp;title=construction" total="1"/><leg:facetYear year="1942" href="http://www.legislation.gov.uk/search/data.feed?year=1942&amp;title=construction" total="1"/><leg:facetYear year="1940" href="http://www.legislation.gov.uk/search/data.feed?year=1940&amp;title=construction" total="2"/><leg:facetYear year="1939" href="http://www.legislation.gov.uk/search/data.feed?year=1939&amp;title=construction" total="1"/><leg:facetYear year="1938" href="http://www.legislation.gov.uk/search/data.feed?year=1938&amp;title=construction" total="1"/><leg:facetYear year="1934" href="http://www.legislation.gov.uk/search/data.feed?year=1934&amp;title=construction" total="1"/><leg:facetYear year="1933" href="http://www.legislation.gov.uk/search/data.feed?year=1933&amp;title=construction" total="1"/><leg:facetYear year="1932" href="http://www.legislation.gov.uk/search/data.feed?year=1932&amp;title=construction" total="1"/><leg:facetYear year="1931" href="http://www.legislation.gov.uk/search/data.feed?year=1931&amp;title=construction" total="1"/><leg:facetYear year="1930" href="http://www.legislation.gov.uk/search/data.feed?year=1930&amp;title=construction" total="1"/><leg:facetYear year="1927" href="http://www.legislation.gov.uk/search/data.feed?year=1927&amp;title=construction" total="2"/><leg:facetYear year="1917" href="http://www.legislation.gov.uk/search/data.feed?year=1917&amp;title=construction" total="1"/><leg:facetYear year="1912" href="http://www.legislation.gov.uk/search/data.feed?year=1912&amp;title=construction" total="1"/><leg:facetYear year="1837" href="http://www.legislation.gov.uk/search/data.feed?year=1837&amp;title=construction" total="1"/></leg:facetYears>
        <leg:facetHundreds/>

    </leg:facets>
    <leg:title><leg:term>construction</leg:term></leg:title>

    <link rel="first" type="application/atom+xml" href="http://www.legislation.gov.uk/title/construction/data.feed"/><link rel="next" type="application/atom+xml" href="http://www.legislation.gov.uk/title/construction/data.feed?page=2"/>
    <entry>
    <id>http://www.legislation.gov.uk/id/eudn/2020/1574</id>
    <title>TNA Title 1</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2020/1574"/>
    <link href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/1574/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T01:30:02Z</updated>
    <published>2020-10-28T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2020"/><ukm:Number Value="1574"/><ukm:CreationDate Date="2020-10-28"/>



    <summary>TNA Title 1</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2020/1531</id>
    <title>Decision (EU) 2020/1531 of the European Parliament and of the Council of 21 October 2020 empowering France to negotiate, sign and conclude an international agreement supplementing the Treaty between France and the United Kingdom of Great Britain and Northern Ireland concerning the Construction and Operation by Private Concessionaires of a Channel Fixed Link</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2020/1531"/>
    <link href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/1531/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-12T14:51:44Z</updated>
    <published>2020-10-21T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2020"/><ukm:Number Value="1531"/><ukm:CreationDate Date="2020-10-21"/>



    <summary>Decision (EU) 2020/1531 of the European Parliament and of the Council of 21 October 2020 empowering France to negotiate, sign and conclude an international agreement supplementing the Treaty between France and the United Kingdom of Great Britain and Northern Ireland concerning the Construction and Operation by Private Concessionaires of a Channel Fixed Link</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2020/1170</id>
    <title>Commission Implementing Regulation (EU) 2020/1170 of 16 July 2020 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2019/1397 (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2020/1170"/>
    <link href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2020/1170/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-12T23:07:45Z</updated>
    <published>2020-07-16T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2020"/><ukm:Number Value="1170"/><ukm:CreationDate Date="2020-07-16"/>



    <summary>Commission Implementing Regulation (EU) 2020/1170 of 16 July 2020 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2019/1397 (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2020/962</id>
    <title>Commission Implementing Decision (EU) 2020/962 of 2 July 2020 amending Implementing Decision (EU) 2019/450 as regards the publication of references of European Assessment Documents for certain construction products (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2020/962"/>
    <link href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/962/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T19:20:35Z</updated>
    <published>2020-07-02T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2020"/><ukm:Number Value="962"/><ukm:CreationDate Date="2020-07-02"/>



    <summary>Commission Implementing Decision (EU) 2020/962 of 2 July 2020 amending Implementing Decision (EU) 2019/450 as regards the publication of references of European Assessment Documents for certain construction products (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2020/50</id>
    <title>Commission Implementing Decision (EU) 2020/50 of 21 January 2020 amending Implementing Decision (EU) 2019/919 on the harmonised standards for recreational craft and personal watercraft drafted in support of Directive 2013/53/EU of the European Parliament and of the Council as regards small craft identification, coding system, hull construction and scantlings for monohulls</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2020/50"/>
    <link href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2020/50/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T20:35:27Z</updated>
    <published>2020-01-21T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2020"/><ukm:Number Value="50"/><ukm:CreationDate Date="2020-01-21"/>



    <summary>Commission Implementing Decision (EU) 2020/50 of 21 January 2020 amending Implementing Decision (EU) 2019/919 on the harmonised standards for recreational craft and personal watercraft drafted in support of Directive 2013/53/EU of the European Parliament and of the Council as regards small craft identification, coding system, hull construction and scantlings for monohulls</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2019/1397</id>
    <title>Commission Implementing Regulation (EU) 2019/1397 of 6 August 2019 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2018/773 (Text with EEA relevance) (repealed)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2019/1397"/>
    <link href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2019/1397/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-12T23:12:15Z</updated>
    <published>2019-08-06T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2019"/><ukm:Number Value="1397"/><ukm:CreationDate Date="2019-08-06"/>



    <summary>Commission Implementing Regulation (EU) 2019/1397 of 6 August 2019 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2018/773 (Text with EEA relevance) (repealed)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2019/451</id>
    <title>Commission Implementing Decision (EU) 2019/451 of 19 March 2019 on the harmonised standards for construction products drafted in support of Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2019/451"/>
    <link href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2019/451/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T20:57:27Z</updated>
    <published>2019-03-19T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2019"/><ukm:Number Value="451"/><ukm:CreationDate Date="2019-03-19"/>



    <summary>Commission Implementing Decision (EU) 2019/451 of 19 March 2019 on the harmonised standards for construction products drafted in support of Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2019/450</id>
    <title>Commission Implementing Decision (EU) 2019/450 of 19 March 2019 on publication of the European Assessment Documents (EADs) for construction products drafted in support of Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2019/450"/>
    <link href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2019/450/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T21:12:01Z</updated>
    <published>2019-03-19T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2019"/><ukm:Number Value="450"/><ukm:CreationDate Date="2019-03-19"/>



    <summary>Commission Implementing Decision (EU) 2019/450 of 19 March 2019 on publication of the European Assessment Documents (EADs) for construction products drafted in support of Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2019/1764</id>
    <title>Commission Delegated Decision (EU) 2019/1764 of 14 March 2019 supplementing Regulation (EU) No 305/2011 of the European Parliament and of the Council with regard to the applicable systems to assess and verify constancy of performance of balustrade kits and railing kits intended to be used in construction works solely to prevent falls and not submitted to vertical loads from the structure (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2019/1764"/>
    <link href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2019/1764/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-12T15:27:02Z</updated>
    <published>2019-03-14T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2019"/><ukm:Number Value="1764"/><ukm:CreationDate Date="2019-03-14"/>



    <summary>Commission Delegated Decision (EU) 2019/1764 of 14 March 2019 supplementing Regulation (EU) No 305/2011 of the European Parliament and of the Council with regard to the applicable systems to assess and verify constancy of performance of balustrade kits and railing kits intended to be used in construction works solely to prevent falls and not submitted to vertical loads from the structure (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2018/773</id>
    <title>
        <div xmlns="http://www.w3.org/1999/xhtml">
                <span xml:lang="en">Commission Implementing Regulation (EU) 2018/773 of 15 May 2018 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2017/306 (Text with EEA relevance) (repealed)</span> /
                <span xml:lang="cy">Gorchymyn Deddf Democratiaeth Leol, Datblygu Economaidd ac Adeiladu 2009 (Cychwyn Rhif 2) (Cymru) 2011</span>
            </div>
    </title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2018/773"/>
    <link href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/773/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-12T23:21:11Z</updated>
    <published>2018-05-15T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2018"/><ukm:Number Value="773"/><ukm:CreationDate Date="2018-05-15"/>



    <summary>Commission Implementing Regulation (EU) 2018/773 of 15 May 2018 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2017/306 (Text with EEA relevance) (repealed)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2018/830</id>
    <title>
       <div xmlns="http://www.w3.org/1999/xhtml">
                <span xml:lang="cy">Commission Delegated Regulation (EU) 2018/830 of 9 March 2018 amending Annex I to Regulation (EU) No 167/2013 of the European Parliament and of the Council and Commission Delegated Regulation (EU) No 1322/2014 as regards the adaptation of the vehicle construction and general requirements for the approval of agricultural and forestry vehicles</span>
            </div>
      </title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2018/830"/>
    <link href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2018/830/2018-03-09/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/830/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2022-01-24T13:29:04Z</updated>
    <published>2018-03-09T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2018"/><ukm:Number Value="830"/><ukm:CreationDate Date="2018-03-09"/>



    <summary>Commission Delegated Regulation (EU) 2018/830 of 9 March 2018 amending Annex I to Regulation (EU) No 167/2013 of the European Parliament and of the Council and Commission Delegated Regulation (EU) No 1322/2014 as regards the adaptation of the vehicle construction and general requirements for the approval of agricultural and forestry vehicles</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2018/502</id>
    <title>Commission Implementing Regulation (EU) 2018/502 of 28 February 2018 amending Implementing Regulation (EU) 2016/799 laying down the requirements for the construction, testing, installation, operation and repair of tachographs and their components (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2018/502"/>
    <link href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2018/502/2018-02-28/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/502/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2021-07-09T12:33:08Z</updated>
    <published>2018-02-28T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2018"/><ukm:Number Value="502"/><ukm:CreationDate Date="2018-02-28"/>



    <summary>Commission Implementing Regulation (EU) 2018/502 of 28 February 2018 amending Implementing Regulation (EU) 2016/799 laying down the requirements for the construction, testing, installation, operation and repair of tachographs and their components (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2018/771</id>
    <title>Commission Delegated Decision (EU) 2018/771 of 25 January 2018 on the applicable system to assess and verify constancy of performance of anchor devices used for construction works and intended to prevent persons from falling from a height or to arrest falls from a height pursuant to Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2018/771"/>
    <link href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2018/771/2018-01-25/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2018/771/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T00:36:39Z</updated>
    <published>2018-01-25T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2018"/><ukm:Number Value="771"/><ukm:CreationDate Date="2018-01-25"/>



    <summary>Commission Delegated Decision (EU) 2018/771 of 25 January 2018 on the applicable system to assess and verify constancy of performance of anchor devices used for construction works and intended to prevent persons from falling from a height or to arrest falls from a height pursuant to Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2018/295</id>
    <title>Commission Delegated Regulation (EU) 2018/295 of 15 December 2017 amending Delegated Regulation (EU) No 44/2014, as regards vehicle construction and general requirements, and Delegated Regulation (EU) No 134/2014, as regards environmental and propulsion unit performance requirements for the approval of two- or three-wheel vehicles and quadricycles</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2018/295"/>
    <link href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2018/295/2017-12-15/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2018/295/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2022-01-24T12:35:14Z</updated>
    <published>2017-12-15T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2018"/><ukm:Number Value="295"/><ukm:CreationDate Date="2017-12-15"/>



    <summary>Commission Delegated Regulation (EU) 2018/295 of 15 December 2017 amending Delegated Regulation (EU) No 44/2014, as regards vehicle construction and general requirements, and Delegated Regulation (EU) No 134/2014, as regards environmental and propulsion unit performance requirements for the approval of two- or three-wheel vehicles and quadricycles</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eudn/2017/443</id>
    <title>Council Decision (EU) 2017/443 of 6 March 2017 establishing the position to be adopted on behalf of the European Union in the relevant Committees of the United Nations Economic Commission for Europe as regards the proposals for amendments to UN Regulations Nos 3, 4, 6, 7, 13, 19, 23, 27, 28, 38, 39, 43, 45, 50, 69, 70, 73, 75, 77, 79, 83, 87, 91, 98, 99, 101, 104, 107, 109, 110, 112, 118, 119, 123 and 138, and one proposal for amending the Consolidated Resolution on the Construction of Vehicles (R.E.3) by guidelines on cyber security and data protection</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eudn/2017/443"/>
    <link href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eudn/2017/443/2017-03-06/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eudn/2017/443/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T19:35:52Z</updated>
    <published>2017-03-06T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionDecision"/><ukm:Year Value="2017"/><ukm:Number Value="443"/><ukm:CreationDate Date="2017-03-06"/>



    <summary>Council Decision (EU) 2017/443 of 6 March 2017 establishing the position to be adopted on behalf of the European Union in the relevant Committees of the United Nations Economic Commission for Europe as regards the proposals for amendments to UN Regulations Nos 3, 4, 6, 7, 13, 19, 23, 27, 28, 38, 39, 43, 45, 50, 69, 70, 73, 75, 77, 79, 83, 87, 91, 98, 99, 101, 104, 107, 109, 110, 112, 118, 119, 123 and 138, and one proposal for amending the Consolidated Resolution on the Construction of Vehicles (R.E.3) by guidelines on cyber security and data protection</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2017/306</id>
    <title>Commission Implementing Regulation (EU) 2017/306 of 6 February 2017 indicating design, construction and performance requirements and testing standards for marine equipment (Text with EEA relevance) (repealed)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2017/306"/>
    <link href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2017/306/2018-06-18/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2017/306/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-11T01:32:49Z</updated>
    <published>2017-02-06T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2017"/><ukm:Number Value="306"/><ukm:CreationDate Date="2017-02-06"/>



    <summary>Commission Implementing Regulation (EU) 2017/306 of 6 February 2017 indicating design, construction and performance requirements and testing standards for marine equipment (Text with EEA relevance) (repealed)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2016/1824</id>
    <title>Commission Delegated Regulation (EU) 2016/1824 of 14 July 2016 amending Delegated Regulation (EU) No 3/2014, Delegated Regulation (EU) No 44/2014 and Delegated Regulation (EU) No 134/2014 with regard, respectively, to vehicle functional safety requirements, to vehicle construction and general requirements and to environmental and propulsion unit performance requirements (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2016/1824"/>
    <link href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2016/1824/2016-10-15/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/1824/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2020-12-09T20:02:58Z</updated>
    <published>2016-07-14T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2016"/><ukm:Number Value="1824"/><ukm:CreationDate Date="2016-07-14"/>



    <summary>Commission Delegated Regulation (EU) 2016/1824 of 14 July 2016 amending Delegated Regulation (EU) No 3/2014, Delegated Regulation (EU) No 44/2014 and Delegated Regulation (EU) No 134/2014 with regard, respectively, to vehicle functional safety requirements, to vehicle construction and general requirements and to environmental and propulsion unit performance requirements (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2016/1788</id>
    <title>Commission Delegated Regulation (EU) 2016/1788 of 14 July 2016 amending Regulation (EU) No 167/2013 of the European Parliament and of the Council as regards the list of requirements for vehicle EU type-approval, and amending and correcting Commission Delegated Regulations (EU) No 1322/2014, (EU) 2015/96, (EU) 2015/68 and (EU) 2015/208 with regard to vehicle construction and general requirements, to environmental and propulsion unit performance requirements, to vehicle braking requirements and to vehicle functional safety requirements (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2016/1788"/>
    <link href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2016/1788/2016-07-14/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/1788/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2021-07-09T12:53:44Z</updated>
    <published>2016-07-14T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2016"/><ukm:Number Value="1788"/><ukm:CreationDate Date="2016-07-14"/>



    <summary>Commission Delegated Regulation (EU) 2016/1788 of 14 July 2016 amending Regulation (EU) No 167/2013 of the European Parliament and of the Council as regards the list of requirements for vehicle EU type-approval, and amending and correcting Commission Delegated Regulations (EU) No 1322/2014, (EU) 2015/96, (EU) 2015/68 and (EU) 2015/208 with regard to vehicle construction and general requirements, to environmental and propulsion unit performance requirements, to vehicle braking requirements and to vehicle functional safety requirements (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2016/799</id>
    <title>Commission Implementing Regulation (EU) 2016/799 of 18 March 2016 implementing Regulation (EU) No 165/2014 of the European Parliament and of the Council laying down the requirements for the construction, testing, installation, operation and repair of tachographs and their components (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2016/799"/>
    <link href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2016/799/2020-02-26/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/799/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2022-01-31T11:26:50Z</updated>
    <published>2016-03-18T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2016"/><ukm:Number Value="799"/><ukm:CreationDate Date="2016-03-18"/>



    <summary>Commission Implementing Regulation (EU) 2016/799 of 18 March 2016 implementing Regulation (EU) No 165/2014 of the European Parliament and of the Council laying down the requirements for the construction, testing, installation, operation and repair of tachographs and their components (Text with EEA relevance)</summary>
</entry><entry>
    <id>http://www.legislation.gov.uk/id/eur/2016/364</id>
    <title>Commission Delegated Regulation (EU) 2016/364 of 1 July 2015 on the classification of the reaction to fire performance of construction products pursuant to Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</title>
    <link rel="self" href="http://www.legislation.gov.uk/id/eur/2016/364"/>
    <link href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01"/>
    <link rel="alternate" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01/data.xml" title="XML"/><link rel="alternate" type="application/rdf+xml" href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01/data.rdf" title="RDF/XML"/><link rel="alternate" type="application/akn+xml" href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01/data.akn" title="AKN"/><link rel="alternate" type="application/xhtml+xml" href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01/data.xht" title="HTML snippet"/><link rel="alternate" type="application/akn+xhtml" href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01/data.html" title="HTML5 snippet"/><link rel="alternate" type="text/html" href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01/data.htm" title="Website (XHTML) Default View"/><link rel="alternate" type="application/pdf" href="http://www.legislation.gov.uk/eur/2016/364/2015-07-01/data.pdf" title="PDF"/>
    <link rel="http://purl.org/dc/terms/tableOfContents" type="application/xml" href="http://www.legislation.gov.uk/eur/2016/364/contents" title="Table of Contents"/>
    <author><name/></author>
    <updated>2022-01-24T12:54:49Z</updated>
    <published>2015-07-01T00:00:00Z</published>
    <ukm:DocumentMainType Value="EuropeanUnionRegulation"/><ukm:Year Value="2016"/><ukm:Number Value="364"/><ukm:CreationDate Date="2015-07-01"/>



    <summary>Commission Delegated Regulation (EU) 2016/364 of 1 July 2015 on the classification of the reaction to fire performance of construction products pursuant to Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)</summary>
</entry>
</feed>
`;

export const expectedInternalOutputForTnaStandardResponse: SearchResponseDto['legislation'] =
  {
    documents: [
      {
        title: 'TNA Title 1',
        dates: {
          updated: '2020-12-11T01:30:02Z',
          published: '2020-10-28T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eudn/2020/1574',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/2020-10-28/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eudn/2020/1574/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 1574,
        year: 2020,
      },
      {
        title:
          'Decision (EU) 2020/1531 of the European Parliament and of the Council of 21 October 2020 empowering France to negotiate, sign and conclude an international agreement supplementing the Treaty between France and the United Kingdom of Great Britain and Northern Ireland concerning the Construction and Operation by Private Concessionaires of a Channel Fixed Link',
        dates: {
          updated: '2020-12-12T14:51:44Z',
          published: '2020-10-21T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eudn/2020/1531',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/2020-10-21/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eudn/2020/1531/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 1531,
        year: 2020,
      },
      {
        title:
          'Commission Implementing Regulation (EU) 2020/1170 of 16 July 2020 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2019/1397 (Text with EEA relevance)',
        dates: {
          updated: '2020-12-12T23:07:45Z',
          published: '2020-07-16T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eur/2020/1170',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/2020-07-16/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eur/2020/1170/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 1170,
        year: 2020,
      },
      {
        title:
          'Commission Implementing Decision (EU) 2020/962 of 2 July 2020 amending Implementing Decision (EU) 2019/450 as regards the publication of references of European Assessment Documents for certain construction products (Text with EEA relevance)',
        dates: {
          updated: '2020-12-11T19:20:35Z',
          published: '2020-07-02T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eudn/2020/962',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/2020-07-02/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eudn/2020/962/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 962,
        year: 2020,
      },
      {
        title:
          'Commission Implementing Decision (EU) 2020/50 of 21 January 2020 amending Implementing Decision (EU) 2019/919 on the harmonised standards for recreational craft and personal watercraft drafted in support of Directive 2013/53/EU of the European Parliament and of the Council as regards small craft identification, coding system, hull construction and scantlings for monohulls',
        dates: {
          updated: '2020-12-11T20:35:27Z',
          published: '2020-01-21T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eudn/2020/50',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/2020-01-21/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eudn/2020/50/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 50,
        year: 2020,
      },
      {
        title:
          'Commission Implementing Regulation (EU) 2019/1397 of 6 August 2019 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2018/773 (Text with EEA relevance) (repealed)',
        dates: {
          updated: '2020-12-12T23:12:15Z',
          published: '2019-08-06T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eur/2019/1397',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/2020-08-31/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eur/2019/1397/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 1397,
        year: 2019,
      },
      {
        title:
          'Commission Implementing Decision (EU) 2019/451 of 19 March 2019 on the harmonised standards for construction products drafted in support of Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)',
        dates: {
          updated: '2020-12-11T20:57:27Z',
          published: '2019-03-19T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eudn/2019/451',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/2019-03-20/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eudn/2019/451/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 451,
        year: 2019,
      },
      {
        title:
          'Commission Implementing Decision (EU) 2019/450 of 19 March 2019 on publication of the European Assessment Documents (EADs) for construction products drafted in support of Regulation (EU) No 305/2011 of the European Parliament and of the Council (Text with EEA relevance)',
        dates: {
          updated: '2020-12-11T21:12:01Z',
          published: '2019-03-19T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eudn/2019/450',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/2020-10-29/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eudn/2019/450/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 450,
        year: 2019,
      },
      {
        title:
          'Commission Delegated Decision (EU) 2019/1764 of 14 March 2019 supplementing Regulation (EU) No 305/2011 of the European Parliament and of the Council with regard to the applicable systems to assess and verify constancy of performance of balustrade kits and railing kits intended to be used in construction works solely to prevent falls and not submitted to vertical loads from the structure (Text with EEA relevance)',
        dates: {
          updated: '2020-12-12T15:27:02Z',
          published: '2019-03-14T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eudn/2019/1764',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/2019-03-14/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eudn/2019/1764/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 1764,
        year: 2019,
      },
      {
        title:
          'Commission Implementing Regulation (EU) 2018/773 of 15 May 2018 on design, construction and performance requirements and testing standards for marine equipment and repealing Implementing Regulation (EU) 2017/306 (Text with EEA relevance) (repealed)',
        dates: {
          updated: '2020-12-12T23:21:11Z',
          published: '2018-05-15T00:00:00Z',
        },
        legislationType: 'European Union Legislation',
        links: [
          {
            href: 'http://www.legislation.gov.uk/id/eur/2018/773',
            rel: 'self',
          },
          {
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02',
          },
          {
            title: 'XML',
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.xml',
            type: 'application/xml',
            rel: 'alternate',
          },
          {
            title: 'RDF/XML',
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.rdf',
            type: 'application/rdf+xml',
            rel: 'alternate',
          },
          {
            title: 'AKN',
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.akn',
            type: 'application/akn+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML snippet',
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.xht',
            type: 'application/xhtml+xml',
            rel: 'alternate',
          },
          {
            title: 'HTML5 snippet',
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.html',
            type: 'application/akn+xhtml',
            rel: 'alternate',
          },
          {
            title: 'Website (XHTML) Default View',
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.htm',
            type: 'text/html',
            rel: 'alternate',
          },
          {
            title: 'PDF',
            href: 'http://www.legislation.gov.uk/eur/2018/773/2019-10-02/data.pdf',
            type: 'application/pdf',
            rel: 'alternate',
          },
          {
            title: 'Table of Contents',
            href: 'http://www.legislation.gov.uk/eur/2018/773/contents',
            type: 'application/xml',
            rel: 'http://purl.org/dc/terms/tableOfContents',
          },
        ],
        number: 773,
        year: 2018,
      },
    ],
    totalSearchResults: 20,
  };
export const expectedApiOutputForTnaStandardResponse: ApiSearchResponseDto['legislation'] =
  snakecaseKeys(expectedInternalOutputForTnaStandardResponse);
