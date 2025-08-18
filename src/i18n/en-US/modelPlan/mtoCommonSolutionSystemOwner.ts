import { TranslationMTOCommonSolutionSystemOwnerCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

const mtoCommonSolutionSystemOwner: TranslationMTOCommonSolutionSystemOwnerCustom =
  {
    key: {
      gqlField: 'key',
      goField: 'Key',
      dbField: 'mto_common_solution_key',
      label: 'MTO Common Solution',
      dataType: TranslationDataType.ENUM,
      formType: TranslationFormType.SELECT,
      tableReference: TableName.MTO_COMMON_SOLUTION,
      order: 1.1
    },
    cmsComponent: {
      gqlField: 'cmsComponent',
      goField: 'CmsComponent',
      dbField: 'cms_component',
      label: 'CMS component',
      sublabel: 'Select from the list of CMS offices and centers.',
      dataType: TranslationDataType.ENUM,
      formType: TranslationFormType.SELECT,
      options: {
        OFFICE_OF_THE_ADMINISTRATOR: 'Office of the Administrator',
        OFFICE_OF_HEALTHCARE_EXPERIENCE_AND_INTEROPERABILITY:
          'Office of Healthcare Experience and Interoperability',
        OFFICE_OF_PROGRAM_OPERATIONS_AND_LOCAL_ENGAGEMENT_OPOLE:
          'Office of Program Operations and Local Engagement (OPOLE)',
        OFFICE_OF_ENTERPRISE_DATA_AND_ANALYTICS_OEDA:
          'Office of Enterprise Data and Analytics (OEDA)',
        OFFICE_OF_EQUAL_OPPORTUNITY_AND_CIVIL_RIGHTS:
          'Office of Equal Opportunity and Civil Rights',
        OFFICE_OF_COMMUNICATIONS_OC: 'Office of Communications (OC)',
        OFFICE_OF_LEGISLATION: 'Office of Legislation',
        FEDERAL_COORDINATED_HEALTH_CARE_OFFICE:
          'Federal Coordinated Health Care Office',
        OFFICE_OF_MINORITY_HEALTH_OMH: 'Office of Minority Health (OMH)',
        OFFICE_OF_THE_ACTUARY_OACT: 'Office of the Actuary (OACT)',
        OFFICE_OF_STRATEGIC_OPERATIONS_AND_REGULATORY_AFFAIRS_OSORA:
          'Office of Strategic Operations and Regulatory Affairs (OSORA)',
        OFFICE_OF_INFORMATION_TECHNOLOGY_OIT:
          'Office of Information Technology (OIT)',
        OFFICE_OF_ACQUISITION_AND_GRANTS_MANAGEMENT_OAGM:
          'Office of Acquisition and Grants Management (OAGM)',
        OFFICES_OF_HEARINGS_AND_INQUIRIES: 'Offices of Hearings and Inquiries',
        OFFICE_OF_FINANCIAL_MANAGEMENT_OFM:
          'Office of Financial Management (OFM)',
        OFFICE_OF_STRATEGY_PERFORMANCE_AND_RESULTS_OSPR:
          'Office of Strategy, Performance and Results (OSPR)',
        OFFICE_OF_SECURITY_FACILITIES_AND_LOGISTICS_OPERATIONS_OSFLO:
          'Office of Security, Facilities and Logistics Operations (OSFLO)',
        OFFICE_OF_HUMAN_CAPITAL: 'Office of Human Capital',
        CENTER_FOR_CLINICAL_STANDARDS_AND_QUALITY_CCSQ:
          'Center for Clinical Standards and Quality (CCSQ)',
        CENTER_FOR_MEDICARE_AND_MEDICAID_INNOVATION_CMMI:
          'Center for Medicare and Medicaid Innovation (CMMI)',
        CENTER_FOR_MEDICARE_CM: 'Center for Medicare (CM)',
        CENTER_FOR_MEDICAID_AND_CHIP_SERVICES_CMCS:
          'Center for Medicaid and CHIP Services (CMCS)',
        CENTER_FOR_PROGRAM_INTEGRITY_CPI: 'Center for Program Integrity (CPI)',
        CENTER_FOR_CONSUMER_INFORMATION_AND_INSURANCE_OVERSIGHT_CCIIO:
          'Center for Consumer Information and Insurance Oversight (CCIIO)'
      },
      order: 1.2
    },
    ownerType: {
      gqlField: 'ownerType',
      goField: 'OwnerType',
      dbField: 'owner_type',
      label: 'Owner type',
      dataType: TranslationDataType.ENUM,
      formType: TranslationFormType.RADIO,
      options: {
        BUSINESS_OWNER: 'Business Owner',
        SYSTEM_OWNER: 'System Owner'
      },
      order: 1.3
    }
  };

export const mtoCommonSolutionSystemOwnerMisc = {
  addSystemOwner: {
    title: 'Add owner information',
    description:
      'Select the CMS component that is the Business Owner or System Owner for the system, contract, team, or solution.',
    cta: 'Add owner',
    success: 'You added <bold>{{-owner}}</bold> as an owner.',
    error:
      'There was an issue adding owner(s). Please try again, and if the problem persists, try again later.'
  },
  editSystemOwner: {
    title: 'Edit owner information',
    cta: 'Save changes',
    success: 'You updated owner information for <bold>{{-owner}}</bold>.',
    error:
      'There was an issue editing owner(s). Please try again, and if the problem persists, try again later.'
  },
  removeSystemOwner: {
    title: 'Are you sure you want to remove this owner?',
    text: '<bold>Business Owner or System Owner to be removed:</bold><br/>{{-contact}}',
    cta: 'Remove owner',
    success: 'You removed <bold>{{-contact}}</bold> as an owner.',
    error:
      'There was an issue removing this owner. Please try again, and if the problem persists, try again later.'
  },
  allFieldsRequired:
    'Fields marked with an asterisk ( <s>*</s> ) are required.',
  actionWarning: 'This action cannot be undone.',
  cancel: 'Cancel',
  duplicateError:
    '<bold>{{-owner}}</bold> is already added to this solution and cannot be added again. Please edit the existing entry.',
  alert:
    'This point of contact will receive notifications when this solution is selected. Please make sure this individual should receive these notifications before you proceed.'
};
export default mtoCommonSolutionSystemOwner;
