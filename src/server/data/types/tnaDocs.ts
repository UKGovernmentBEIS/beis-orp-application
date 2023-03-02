export type TnaUkDoc = {
  Legislation: {
    'ukm:Metadata': {
      'ukm:SecondaryMetadata': {
        'ukm:DocumentClassification': {
          'ukm:DocumentMainType': {
            _attributes: {
              Value: string;
            };
          };
        };
      };
      'ukm:Year': {
        _attributes: {
          Value: string;
        };
      };
      'ukm:Number': {
        _attributes: {
          Value: string;
        };
      };
    };
  };
};

export type TnaEuDoc = {
  Legislation: {
    'ukm:Metadata': {
      'ukm:EUMetadata': {
        'ukm:DocumentClassification': {
          'ukm:DocumentMainType': {
            _attributes: {
              Value: string;
            };
          };
        };
        'ukm:Year': {
          _attributes: {
            Value: string;
          };
        };
        'ukm:Number': {
          _attributes: {
            Value: string;
          };
        };
      };
    };
  };
};

export const isEuDocument = (doc: any): doc is TnaEuDoc =>
  !!doc.Legislation['ukm:Metadata']['ukm:EUMetadata'];
