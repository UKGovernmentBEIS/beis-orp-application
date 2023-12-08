import { Regulator } from '../entities/regulator';

const regulators: Regulator[] = [
  {
    id: 'ukas',
    name: 'Accreditation Service',
    domain: 'ukas.com',
  },
  {
    id: 'asa',
    name: 'Advertising Standards Authority',
    domain: 'asa.org.uk',
  },
  {
    id: 'bsb',
    name: 'Bar Standards Board',
    domain: 'barstandardsboard.org.uk',
  },
  {
    id: 'bbfc',
    name: 'British Board of Film Classification',
    domain: 'bbfc.co.uk',
  },
  {
    id: 'cqc',
    name: 'Care Quality Commission',
    domain: 'cqc.org.uk',
  },
  {
    id: 'ccew',
    name: 'Charity Commission for England and Wales',
    domain: 'charitycommission.gov.uk',
  },
  {
    id: 'cimspa',
    name: 'Chartered Institute for the Management of Sport and Physical Activity',
    domain: 'cimspa.co.uk',
  },
  {
    id: 'cilex',
    name: 'Chartered Institute of Legal Executives',
    domain: 'cilexregulation.org.uk',
  },
  {
    id: 'caa',
    name: 'Civil Aviation Authority',
    domain: 'caa.co.uk',
  },
  {
    id: 'cma',
    name: 'Competition and Markets Authority',
    domain: 'cma.gov.uk',
  },
  {
    id: 'cnhc',
    name: 'Complementary and Natural Healthcare Council',
    domain: 'cnhc.org.uk',
  },
  {
    id: 'clc',
    name: 'Council for Licensed Conveyancers',
    domain: 'clc-uk.org',
  },
  {
    id: 'corgi',
    name: 'Council for Registered Gas Installers',
    domain: 'gassaferegister.co.uk',
  },
  {
    id: 'engc',
    name: 'Engineering Council',
    domain: 'engc.org.uk',
  },
  {
    id: 'ea',
    name: 'Environment Agency',
    domain: 'environment-agency.gov.uk',
  },
  {
    id: 'ehrc',
    name: 'Equality and Human Rights Commission',
    domain: 'equalityhumanrights.com',
  },
  {
    id: 'fca',
    name: 'Financial Conduct Authority',
    domain: 'fca.org.uk',
  },
  {
    id: 'frc',
    name: 'Financial Reporting Council',
    domain: 'frc.org.uk',
  },
  {
    id: 'fsa',
    name: 'Food Standards Agency',
    domain: 'food.gov.uk',
  },
  {
    id: 'fsr',
    name: 'Forensic Science Regulator',
    domain: 'homeoffice.gov.uk',
  },
  {
    id: 'fr',
    name: 'Fundraising Regulator',
    domain: 'fundraisingregulator.org.uk',
  },
  {
    id: 'gc',
    name: 'Gambling Commission',
    domain: 'gamblingcommission.gov.uk',
  },
  {
    id: 'glaa',
    name: 'Gangmasters and Labour Abuse Authority',
    domain: 'gla.gov.uk',
  },
  {
    id: 'gcc',
    name: 'General Chiropractic Council',
    domain: 'gcc-uk.org',
  },
  {
    id: 'gdc',
    name: 'General Dental Council',
    domain: 'gdc-uk.org',
  },
  {
    id: 'gmc',
    name: 'General Medical Council',
    domain: 'gmc-uk.org',
  },
  {
    id: 'goc',
    name: 'General Optical Council',
    domain: 'optical.org',
  },
  {
    id: 'gosc',
    name: 'General Osteopathic Council',
    domain: 'osteopathy.org.uk',
  },
  {
    id: 'gphc',
    name: 'General Pharmaceutical Council',
    domain: 'pharmacyregulation.org',
  },
  {
    id: 'hcpc',
    name: 'Health and Care Professions Council',
    domain: 'hcpc-uk.org',
  },
  {
    id: 'hse',
    name: 'Health and Safety Executive',
    domain: 'hse.gov.uk',
  },
  {
    id: 'hsib',
    name: 'Healthcare Safety Investigation Branch',
    domain: 'hsib.org.uk',
  },
  {
    id: 'hfea',
    name: 'Human Fertilisation and Embryology Authority',
    domain: 'hfea.gov.uk',
  },
  {
    id: 'hta',
    name: 'Human Tissue Authority',
    domain: 'hta.gov.uk',
  },
  {
    id: 'impress',
    name: 'Independent Monitor for the Press',
    domain: 'impressreg.org.uk',
  },
  {
    id: 'iopc',
    name: 'Independent Office for Police Conduct',
    domain: 'policeconduct.gov.uk',
  },
  {
    id: 'ipso',
    name: 'Independent Press Standards Organisation',
    domain: 'ipso.co.uk',
  },
  {
    id: 'ico',
    name: "Information Commissioner's Office",
    domain: 'ico.org.uk',
  },
  {
    id: 'icaew',
    name: 'Institute of Chartered Accountants in England and Wales',
    domain: 'icaew.com',
  },
  {
    id: 'mmo',
    name: 'Marine Management Organisation',
    domain: 'marinemanagement.org.uk',
  },
  {
    id: 'mof',
    name: 'Master of the Faculties',
    domain: '1thesanctuary.com',
  },
  {
    id: 'mhra',
    name: 'Medicines and Healthcare products Regulatory Agency',
    domain: 'mhra.gov.uk',
  },
  {
    id: 'nsta',
    name: 'North Sea Transition Authority',
    domain: 'ogauthority.co.uk',
  },
  {
    id: 'nmc',
    name: 'Nursing and Midwifery Council',
    domain: 'nmc-uk.org',
  },
  {
    id: 'onr',
    name: 'Office for Nuclear Regulation',
    domain: 'onr.gov.uk',
  },
  {
    id: 'ofsted',
    name: "Office for Standards in Education, Children's Services & Skills",
    domain: 'ofsted.gov.uk',
  },
  {
    id: 'ofs',
    name: 'Office for Students',
    domain: 'officeforstudents.org.uk',
  },
  {
    id: 'ofcom',
    name: 'Office of Communications',
    domain: 'ofcom.org.uk',
  },
  {
    id: 'ofgem',
    name: 'Office of Gas and Electricity Markets',
    domain: 'ofgem.gov.uk',
  },
  {
    id: 'ofqual',
    name: 'Office of Qualifications and Examinations Regulation',
    domain: 'ofqual.gov.uk',
  },
  {
    id: 'orr',
    name: 'Office of Rail and Road',
    domain: 'orr.gov.uk',
  },
  {
    id: 'oisc',
    name: 'Office of the Immigration Services Commissioner',
    domain: 'oisc.gov.uk',
  },
  {
    id: 'orcic',
    name: 'Office of the Regulator of Community Interest Companies',
    domain: 'companieshouse.gov.uk',
  },
  {
    id: 'psr',
    name: 'Payment Systems Regulator',
    domain: 'psr.org.uk',
  },
  {
    id: 'tpr',
    name: 'Pensions Regulator',
    domain: 'rpa.gov.uk',
  },
  {
    id: 'pins',
    name: 'Planning Inspectorate',
    domain: 'planninginspectorate.gov.uk',
  },
  {
    id: 'psa',
    name: 'Professional Standards Authority for Health and Social Care',
    domain: 'professionalstandards.org.uk',
  },
  {
    id: 'pra',
    name: 'Prudential Regulation Authority',
    domain: 'bankofengland.co.uk',
  },
  {
    id: 'rsh',
    name: 'Regulator of Social Housing',
    domain: 'rsh.gov.uk',
  },
  {
    id: 'sia',
    name: 'Security Industry Authority',
    domain: 'sia.gov.uk',
  },
  {
    id: 'swe',
    name: 'Social Work England',
    domain: 'socialworkengland.org.uk',
  },
  {
    id: 'sra',
    name: 'Solicitors Regulation Authority',
    domain: 'sra.org.uk',
  },
  {
    id: 'dmc',
    name: 'The Data and Marketing Commission',
    domain: 'dmcomission.com',
  },
  {
    id: 'opbas',
    name: 'The Office for Professional Body Anti-Money Laundering Supervision',
    domain: 'fca.gov.uk',
  },
  {
    id: 'ofwat',
    name: 'Water Services Regulation Authority',
    domain: 'ofwat.gov.uk',
  },
  {
    id: 'gmail',
    name: 'gmail test',
    domain: 'gmail.com',
  },
  {
    id: 'Safety',
    name: 'Safety Tech Accelerator',
    domain: 'lr.org',
  },
];

export default regulators;
