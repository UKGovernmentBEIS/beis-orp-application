import {
  isPrimaryLegislation,
  TnaEuDoc,
  TnaPrimaryUkDoc,
  TnaSecondaryUkDoc,
} from '../../data/types/tnaDocs';
import TnaDocMeta from '../types/TnaDocMeta';
import { getTnaDocType } from './tnaDocumentType.config';

function getDocClassificationForUkDoc(
  document: TnaSecondaryUkDoc | TnaPrimaryUkDoc,
) {
  if (isPrimaryLegislation(document)) {
    return {
      classification:
        document.Legislation['ukm:Metadata']['ukm:PrimaryMetadata'][
          'ukm:DocumentClassification'
        ],
      year: document.Legislation['ukm:Metadata']['ukm:PrimaryMetadata'][
        'ukm:Year'
      ],
      number:
        document.Legislation['ukm:Metadata']['ukm:PrimaryMetadata'][
          'ukm:Number'
        ],
      title: document.Legislation['ukm:Metadata']['dc:title'],
    };
  }

  return {
    classification:
      document.Legislation['ukm:Metadata']['ukm:SecondaryMetadata'][
        'ukm:DocumentClassification'
      ],
    year: document.Legislation['ukm:Metadata']['ukm:SecondaryMetadata'][
      'ukm:Year'
    ],
    number:
      document.Legislation['ukm:Metadata']['ukm:SecondaryMetadata'][
        'ukm:Number'
      ],
    title: document.Legislation['ukm:Metadata']['dc:title'],
  };
}
export function getMetaFromUkDoc(
  document: TnaSecondaryUkDoc | TnaPrimaryUkDoc,
): TnaDocMeta {
  const { classification, year, number, title } =
    getDocClassificationForUkDoc(document);

  return {
    title: title._text,
    docType: getTnaDocType(
      classification['ukm:DocumentMainType']._attributes.Value,
    ).legType,
    year: year._attributes.Value,
    number: number._attributes.Value,
  };
}

export function getMetaFromEuDoc(document: TnaEuDoc): TnaDocMeta {
  const metaData = document.Legislation['ukm:Metadata'];
  const secondaryMeta = metaData['ukm:EUMetadata'];
  const documentClassification = secondaryMeta['ukm:DocumentClassification'];

  return {
    title: metaData['dc:title']._text,
    docType: getTnaDocType(
      documentClassification['ukm:DocumentMainType']._attributes.Value,
    ).legType,
    year: secondaryMeta['ukm:Year']._attributes.Value,
    number: secondaryMeta['ukm:Number']._attributes.Value,
  };
}
