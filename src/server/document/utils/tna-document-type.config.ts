type TnaDocType = {
  legDivision: string;
  legType:
    | 'Primary'
    | 'Secondary'
    | 'United Kingdom Order'
    | 'European Union Legislation';
  divAbbv: string;
};
export const tnaDoucmentTypes: TnaDocType[] = [
  {
    legDivision: 'UnitedKingdomRoyalProclamation',
    legType: 'Primary',
    divAbbv: 'ukrp',
  },
  {
    legDivision: 'WelshParliamentAct',
    legType: 'Primary',
    divAbbv: 'asc',
  },
  {
    legDivision: 'NorthernIrelandStatutoryRuleOrOrder',
    legType: 'Secondary',
    divAbbv: 'nisro',
  },
  {
    legDivision: 'UnitedKingdomOrderInOrOfCouncil',
    legType: 'United Kingdom Order',
    divAbbv: 'ukoioc',
  },
  {
    legDivision: 'ScottishAct',
    legType: 'Primary',
    divAbbv: 'asp',
  },
  {
    legDivision: 'UnitedKingdomLettersPatent',
    legType: 'Primary',
    divAbbv: 'uklp',
  },
  {
    legDivision: 'UnitedKingdomStatutoryRuleOrOrder',
    legType: 'Secondary',
    divAbbv: 'uksro',
  },
  {
    legDivision: 'NorthernIrelandOrderInCouncil',
    legType: 'Primary',
    divAbbv: 'nisi',
  },
  {
    legDivision: 'EnglandAct',
    legType: 'Primary',
    divAbbv: 'aep',
  },
  {
    legDivision: 'UnitedKingdomMinisterialOrder',
    legType: 'Secondary',
    divAbbv: 'ukmo',
  },
  {
    legDivision: 'ScottishOldAct',
    legType: 'Primary',
    divAbbv: 'aosp',
  },
  {
    legDivision: 'UnitedKingdomPublicGeneralAct',
    legType: 'Primary',
    divAbbv: 'ukpga',
  },
  {
    legDivision: 'EuropeanUnionDecision',
    legType: 'European Union Legislation',
    divAbbv: 'eud',
  },
  {
    legDivision: 'UnitedKingdomRoyalInstructions',
    legType: 'Primary',
    divAbbv: 'ukri',
  },
  {
    legDivision: 'UnitedKingdomChurchMeasure',
    legType: 'Primary',
    divAbbv: 'ukcm',
  },
  {
    legDivision: 'GreatBritainPrivateOrPersonalAct',
    legType: 'Primary',
    divAbbv: 'gbppa',
  },
  {
    legDivision: 'IrelandAct',
    legType: 'Primary',
    divAbbv: 'aip',
  },
  {
    legDivision: 'EuropeanUnionRegulation',
    legType: 'European Union Legislation',
    divAbbv: 'eur',
  },
  {
    legDivision: 'NorthernIrelandAct',
    legType: 'Primary',
    divAbbv: 'nia',
  },
  {
    legDivision: 'UnitedKingdomMinisterialDirection',
    legType: 'Secondary',
    divAbbv: 'ukmd',
  },
  {
    legDivision: 'WelshAssemblyMeasure',
    legType: 'Primary',
    divAbbv: 'mwa',
  },
  {
    legDivision: 'EnglandPrivateOrPersonalAct',
    legType: 'Primary',
    divAbbv: 'eppa',
  },
  {
    legDivision: 'GreatBritainAct',
    legType: 'Primary',
    divAbbv: 'apgb',
  },
  {
    legDivision: 'UnitedKingdomStatutoryInstrument',
    legType: 'Secondary',
    divAbbv: 'uksi',
  },
  {
    legDivision: 'GreatBritainLocalAct',
    legType: 'Primary',
    divAbbv: 'gbla',
  },
  {
    legDivision: 'NorthernIrelandAssemblyMeasure',
    legType: 'Primary',
    divAbbv: 'mnia',
  },
  {
    legDivision: 'NorthernIrelandParliamentAct',
    legType: 'Primary',
    divAbbv: 'apni',
  },
  {
    legDivision: 'NorthernIrelandStatutoryRule',
    legType: 'Secondary',
    divAbbv: 'nisr',
  },
  {
    legDivision: 'ScottishStatutoryInstrument',
    legType: 'Secondary',
    divAbbv: 'ssi',
  },
  {
    legDivision: 'UnitedKingdomChurchInstrument',
    legType: 'Secondary',
    divAbbv: 'ukci',
  },
  {
    legDivision: 'UnitedKingdomLocalAct',
    legType: 'Primary',
    divAbbv: 'ukla',
  },
  {
    legDivision: 'WelshNationalAssemblyAct',
    legType: 'Primary',
    divAbbv: 'anaw',
  },
  {
    legDivision: 'EuropeanUnionTreaty',
    legType: 'European Union Legislation',
    divAbbv: 'eut',
  },
  {
    legDivision: 'UnitedKingdomRoyalCharter',
    legType: 'Primary',
    divAbbv: 'ukrc',
  },
  {
    legDivision: 'UnitedKingdomPrivateOrPersonalAct',
    legType: 'Primary',
    divAbbv: 'ukppa',
  },
  {
    legDivision: 'WelshStatutoryInstrument',
    legType: 'Secondary',
    divAbbv: 'wsi',
  },
  {
    legDivision: 'UnitedKingdomOrder',
    legType: 'United Kingdom Order',
    divAbbv: 'uko',
  },
  {
    legDivision: 'UnitedKingdomOrderInCouncil',
    legType: 'United Kingdom Order',
    divAbbv: 'ukoic',
  },
  {
    legDivision: 'UnitedKingdomOrderOfCouncil',
    legType: 'United Kingdom Order',
    divAbbv: 'ukooc',
  },
  {
    legDivision: 'EuropeanUnionDecision',
    legType: 'European Union Legislation',
    divAbbv: 'eudn',
  },
  {
    legDivision: 'EuropeanUnionDirective',
    legType: 'European Union Legislation',
    divAbbv: 'eudr',
  },
];

export const getTnaDocType = (
  legDivision: string,
): TnaDocType | Record<string, never> =>
  tnaDoucmentTypes.find((docType) => docType.legDivision === legDivision) ?? {};
