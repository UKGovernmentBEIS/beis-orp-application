import { getTopicPathFromLeaf } from '../../ingest/utils/topics';
import { Injectable } from '@nestjs/common';
import { RegulatorService } from '../../regulator/regulator.service';
import { OrpmlMeta } from '../entities/orpml-meta';
import { RawOrpml } from '../../data/entities/raw-orpml';

@Injectable()
export class OrpmlMapper {
  constructor(private readonly regulatorService: RegulatorService) {}

  mapMeta(doc: RawOrpml): OrpmlMeta {
    const { dublinCore, orp, dcat } = doc.metadata;
    const regulator = this.regulatorService.getRegulatorById(
      orp.regulatorId._text,
    );
    const language = new Intl.DisplayNames(['en-GB'], { type: 'language' });
    return {
      contributor: dublinCore.contributor?._text,
      coverage: dublinCore.coverage?._text,
      dates: {
        created: dublinCore.created?._text,
        modified: dublinCore.modified?._text,
        coverageStartDate: dcat.timePeriodCoverageStartDate?._text,
        coverageEndDate: dcat.timePeriodCoverageEndDate?._text,
        archived: dcat.dataArchived?._text,
        uploaded: orp.dateUploaded?._text,
        issued: dublinCore.issued?._text,
      },
      format: dublinCore.format?._text,
      identifier: dublinCore.identifier?._text,
      language: dublinCore.language?._text,
      languageName: language.of(dublinCore.language._text),
      license: dublinCore.license?._text,
      publisher: dublinCore.publisher?._text,
      regulator: regulator.name ?? orp.regulatorId?._text,
      regulatorId: orp.regulatorId?._text,
      regulatoryTopic: orp.regulatoryTopic?._text,
      regulatoryTopics: orp.regulatoryTopic?._text
        ? getTopicPathFromLeaf(orp.regulatoryTopic?._text)
        : [],
      status: orp.status?._text,
      subject: dublinCore.subject?._text,
      title: dublinCore.title?._text,
      type: dublinCore.type?._text,
      uri: orp.uri?._text,
      userId: orp.userId?._text,
    };
  }

  getContent(orpmlString: string): string {
    const startMatch = orpmlString.match(/<body[^>]*>/i);
    const endMatch = orpmlString.match(/<\/body>/i);

    if (startMatch && endMatch) {
      const startIndex = startMatch.index + startMatch[0].length;
      const endIndex = endMatch.index;

      return orpmlString.substring(startIndex, endIndex);
    } else {
      return '';
    }
  }
}
