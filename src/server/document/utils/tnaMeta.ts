import { TnaEuDoc, TnaUkDoc } from '../../data/types/tnaDocs';
import TnaDocMeta from '../types/TnaDocMeta';
import { getTnaDocType } from './tnaDocumentType.config';

export function getMetaFromUkDoc(document: TnaUkDoc): TnaDocMeta {
  const metaData = document.Legislation['ukm:Metadata'];
  const secondaryMeta = metaData['ukm:SecondaryMetadata'];
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
