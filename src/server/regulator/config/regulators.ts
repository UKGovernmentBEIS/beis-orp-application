import { Regulator } from '../types/Regulator';

const regulators: Regulator[] = [
  {
    id: 'procheckup',
    name: 'Procheckup',
    domain: 'procheckup.com',
  },
  {
    id: 'zoonou',
    name: 'Zoonou',
    domain: 'zoonou.com',
  },
  {
    id: 'trustmarque',
    name: 'Trustmarque',
    domain: 'trustmarque.com',
  },
  {
    id: 'public',
    name: 'Public',
    domain: 'public.io',
  },
  {
    id: 'mxt',
    name: 'MDRxTECH',
    domain: 'mdrx.tech',
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
    id: 'ofwat',
    name: 'Water Services Regulation Authority',
    domain: 'ofwat.gov.uk',
  },
  {
    id: 'orr',
    name: 'Office of Rail and Road',
    domain: 'orr.gov.uk',
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
    id: 'fsa',
    name: 'Food Standards Agency',
    domain: 'food.gov.uk',
  },
  {
    id: 'fca',
    name: 'Financial Conduct Authority',
    domain: 'fca.org.uk',
  },
  {
    id: 'hse',
    name: 'Health and Safety Executive',
    domain: 'hse.gov.uk',
  },
  {
    id: 'cqc',
    name: 'Care Quality Commission',
    domain: 'cqc.org.uk',
  },
  {
    id: 'mhra',
    name: 'Medicines and Healthcare products Regulatory Agency',
    domain: 'mhra.gov.uk',
  },
  {
    id: 'ofs',
    name: 'Office for Students',
    domain: 'officeforstudents.org.uk',
  },
  {
    id: 'ofqual',
    name: 'Office of Qualifications and Examinations Regulation',
    domain: 'ofqual.gov.uk',
  },
  {
    id: 'ofsted',
    name: "Office for Standards in Education, Children's Services & Skills",
    domain: 'ofsted.gov.uk',
  },
  {
    id: 'ccew',
    name: 'Charity Commission for England and Wales',
    domain: 'charitycommission.gov.uk',
  },
  {
    id: 'frc',
    name: 'Financial Reporting Council',
    domain: 'frc.org.uk',
  },
  {
    id: 'icaew',
    name: 'Institute of Chartered Accountants in England and Wales',
    domain: 'icaew.com',
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
    id: 'pra',
    name: 'Prudential Regulation Authority',
    domain: 'bankofengland.co.uk',
  },
  {
    id: 'opbas',
    name: 'The Office for Professional Body Anti-Money Laundering Supervision',
    domain: 'fca.gov.uk',
  },
  {
    id: 'ea',
    name: 'Environment Agency',
    domain: 'environment-agency.gov.uk',
  },
  {
    id: 'mmo',
    name: 'Marine Management Organisation',
    domain: 'marinemanagement.org.uk',
  },
  {
    id: 'cnhc',
    name: 'Complementary and Natural Healthcare Council',
    domain: 'cnhc.org.uk',
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
  // {
  //   id: 'nhsi',
  //   name: 'NHS Improvement',
  //   domain: 'nhsi.com',
  // },
  {
    id: 'nmc',
    name: 'Nursing and Midwifery Council',
    domain: 'nmc-uk.org',
  },
  {
    id: 'psa',
    name: 'Professional Standards Authority for Health and Social Care',
    domain: 'professionalstandards.org.uk',
  },
  // {
  //   id: 'rcvs',
  //   name: 'Royal College of Veterinary Surgeons',
  //   domain: 'rcvs.com',
  // },
  // {
  //   id: 'ukhsa',
  //   name: 'UK Health Security Agency',
  //   domain: 'ukhsa.com',
  // },
  {
    id: 'rsh',
    name: 'Regulator of Social Housing',
    domain: 'rsh.gov.uk',
  },
  // {
  //   id: 'acpb',
  //   name: 'Authorised Conveyancing Practitioners Board',
  //   domain: 'acpb.com',
  // },
  {
    id: 'bsb',
    name: 'Bar Standards Board',
    domain: 'barstandardsboard.org.uk',
  },
  {
    id: 'cilex',
    name: 'Chartered Institute of Legal Executives',
    domain: 'cilexregulation.org.uk',
  },
  {
    id: 'mof',
    name: 'Master of the Faculties',
    domain: '1thesanctuary.com',
  },
  {
    id: 'oisc',
    name: 'Office of the Immigration Services Commissioner',
    domain: 'oisc.gov.uk',
  },
  {
    id: 'sra',
    name: 'Solicitors Regulation Authority',
    domain: 'sra.org.uk',
  },
  {
    id: 'clc',
    name: 'Council for Licensed Conveyancers',
    domain: 'clc-uk.org',
  },
  {
    id: 'swe',
    name: 'Social Work England',
    domain: 'socialworkengland.org.uk',
  },
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
    id: 'bbfc',
    name: 'British Board of Film Classification',
    domain: 'bbfc.co.uk',
  },
  {
    id: 'cimspa',
    name: 'Chartered Institute for the Management of Sport and Physical Activity',
    domain: 'cimspa.co.uk',
  },
  {
    id: 'corgi',
    name: 'Council for Registered Gas Installers',
    domain: 'gassaferegister.co.uk',
  },
  {
    id: 'dmc',
    name: 'The Data and Marketing Commission',
    domain: 'dmcomission.com',
  },
  {
    id: 'engc',
    name: 'Engineering Council',
    domain: 'engc.org.uk',
  },
  {
    id: 'ehrc',
    name: 'Equality and Human Rights Commission',
    domain: 'equalityhumanrights.com',
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
    id: 'impress',
    name: 'Independent Monitor for the Press',
    domain: 'impressreg.org.uk',
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
    id: 'nsta',
    name: 'North Sea Transition Authority',
    domain: 'ogauthority.co.uk',
  },
  {
    id: 'pins',
    name: 'Planning Inspectorate',
    domain: 'planninginspectorate.gov.uk',
  },
  {
    id: 'iopc',
    name: 'Independent Office for Police Conduct',
    domain: 'policeconduct.gov.uk',
  },
  {
    id: 'sia',
    name: 'Security Industry Authority',
    domain: 'sia.gov.uk',
  },
  {
    id: 'onr',
    name: 'Office for Nuclear Regulation',
    domain: 'onr.gov.uk',
  },
];

export default regulators;
