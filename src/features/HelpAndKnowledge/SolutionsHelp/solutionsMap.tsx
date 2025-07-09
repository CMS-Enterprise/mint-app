import React from 'react';
import {
  GetMtoSolutionContactsQuery,
  MtoCommonSolutionKey,
  MtoCommonSolutionSubject,
  MtoSolutionType
} from 'gql/generated/graphql';

import {
  OperationalSolutionCategoryRoute,
  OperationalSolutionSubCategories
} from 'types/operationalSolutionCategories';

import GatheringInfoAlert from './SolutionDetails/_components/GatheringInfoAlert';
import Innovation4TimeLine from './SolutionDetails/Solutions/4Innovation';
import BCDATimeLine from './SolutionDetails/Solutions/BCDA';
import CentralizedDataExhangeTimeline from './SolutionDetails/Solutions/CentralizedDataExchange';
import ChronicConditionsTimeline from './SolutionDetails/Solutions/ChronicConditions';
import CMSBoxTimeline from './SolutionDetails/Solutions/CMSBox';
import CMSQualtricsTimeline from './SolutionDetails/Solutions/CMSQualtrics';
import GenericTimeline from './SolutionDetails/Solutions/Generic/Timeline';
import HIGLASTimeline from './SolutionDetails/Solutions/HIGLAS';
import OutlookMailboxTimeLine from './SolutionDetails/Solutions/OutlookMailbox';
import RMADATimeline from './SolutionDetails/Solutions/RMADA';
import SalesforceApplicationReviewTimeline from './SolutionDetails/Solutions/SalesforceApplicationReview';
import SharedSystemsTimeLine from './SolutionDetails/Solutions/SharedSystems';

export type SolutionDetailProps = {
  solution: HelpSolutionType;
};

export type SolutionContactType =
  GetMtoSolutionContactsQuery['mtoCommonSolutions'][0]['contactInformation']['pointsOfContact'][0];

export type SolutionContractorType =
  GetMtoSolutionContactsQuery['mtoCommonSolutions'][0]['contractors'][0];

// TODO:replace this type with query generated once query is added
export type SystemOwnerType = {
  name: string;
  system?: string;
};

export type SolutionGenericType = {
  about: boolean;
  timeline: boolean;
  'points-of-contact': boolean;
};

type SolutionComponentType = (props: SolutionDetailProps) => JSX.Element;

export type ModalSolutionComponentType = {
  about?: SolutionComponentType;
  timeline?: SolutionComponentType;
  'points-of-contact'?: SolutionComponentType;
};

export interface HelpSolutionBaseType {
  key: MtoCommonSolutionKey;
  categories: MtoCommonSolutionSubject[];
  subCategories?: OperationalSolutionSubCategories[];
  acronym?: string;
  type: MtoSolutionType;
  name: string;
  components: ModalSolutionComponentType;
}

export type HelpSolutionType = HelpSolutionBaseType & {
  contractors?: SolutionContractorType[];
  pointsOfContact?: SolutionContactType[];
  systemOwners?: SystemOwnerType[];
  alertPrimaryContact?: boolean;
};

export type HelpSolutionsType = Record<
  MtoCommonSolutionKey,
  HelpSolutionBaseType
>;

export const helpSolutions: HelpSolutionsType = {
  [MtoCommonSolutionKey.INNOVATION]: {
    key: MtoCommonSolutionKey.INNOVATION,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS
    ],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: '4i',
    type: MtoSolutionType.IT_SYSTEM,
    name: '4innovation',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <Innovation4TimeLine {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.ACO_OS]: {
    key: MtoCommonSolutionKey.ACO_OS,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS
    ],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'ACO-OS',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Accountable Care Organization - Operational System',
    components: {
      timeline: (props: SolutionDetailProps) => (
        // Timeline is the same as 4Innovation
        <Innovation4TimeLine
          solution={{ key: 'innovation' } as HelpSolutionType}
        />
      )
    }
  },
  [MtoCommonSolutionKey.APPS]: {
    key: MtoCommonSolutionKey.APPS,
    categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
    acronym: 'APPS',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Automated Plan Payment System',
    components: {}
  },
  [MtoCommonSolutionKey.BCDA]: {
    key: MtoCommonSolutionKey.BCDA,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS
    ],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'BCDA',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Beneficiary Claims Data API',
    components: {
      timeline: (props: SolutionDetailProps) => <BCDATimeLine {...props} />
    }
  },
  [MtoCommonSolutionKey.CDX]: {
    key: MtoCommonSolutionKey.CDX,
    categories: [MtoCommonSolutionSubject.DATA],
    acronym: 'CDX',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Centralized Data Exchange',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <CentralizedDataExhangeTimeline {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.CCW]: {
    key: MtoCommonSolutionKey.CCW,
    categories: [MtoCommonSolutionSubject.DATA],
    acronym: 'CCW',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Chronic Conditions Warehouse',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <ChronicConditionsTimeline {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.CDAC]: {
    key: MtoCommonSolutionKey.CDAC,
    categories: [
      MtoCommonSolutionSubject.CONTRACT_VEHICLES,
      MtoCommonSolutionSubject.DATA
    ],
    acronym: 'CDAC',
    type: MtoSolutionType.CONTRACTOR,
    name: 'CMMI Data Aggregation Contract',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.CMS_BOX]: {
    key: MtoCommonSolutionKey.CMS_BOX,
    categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'CMS Box',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => <CMSBoxTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.CMS_QUALTRICS]: {
    key: MtoCommonSolutionKey.CMS_QUALTRICS,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS
    ],
    subCategories: [OperationalSolutionSubCategories.APPLICATIONS],
    name: 'CMS Qualtrics',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <CMSQualtricsTimeline {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.CBOSC]: {
    key: MtoCommonSolutionKey.CBOSC,
    categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK],
    subCategories: [OperationalSolutionSubCategories.HELP_DESK],
    acronym: 'CBOSC',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Consolidated Business Operations Support Center',
    components: {}
  },
  [MtoCommonSolutionKey.CPI_VETTING]: {
    key: MtoCommonSolutionKey.CPI_VETTING,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS
    ],
    subCategories: [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
    ],
    name: 'CPI Vetting',
    type: MtoSolutionType.OTHER,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.EFT]: {
    key: MtoCommonSolutionKey.EFT,
    categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    acronym: 'EFT',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Electronic File Transfer',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.EDFR]: {
    key: MtoCommonSolutionKey.EDFR,
    categories: [MtoCommonSolutionSubject.DATA],
    acronym: 'eDFR',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Expanded Data Feedback Reporting',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.GOVDELIVERY]: {
    key: MtoCommonSolutionKey.GOVDELIVERY,
    categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'GovDelivery',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.GS]: {
    key: MtoCommonSolutionKey.GS,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS
    ],
    subCategories: [
      OperationalSolutionSubCategories.COOPERATIVE_AGREEMENT_APPS
    ],
    acronym: 'GS',
    type: MtoSolutionType.OTHER,
    name: 'GrantSolutions',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.HIGLAS]: {
    key: MtoCommonSolutionKey.HIGLAS,
    categories: [MtoCommonSolutionSubject.PAYMENTS_AND_FINANCIALS],
    acronym: 'HIGLAS',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Healthcare Integrated General Ledger Accounting System',
    components: {
      timeline: (props: SolutionDetailProps) => <HIGLASTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.HDR]: {
    key: MtoCommonSolutionKey.HDR,
    categories: [
      MtoCommonSolutionSubject.DATA,
      MtoCommonSolutionSubject.QUALITY
    ],
    acronym: 'HDR',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Health Data Reporting',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.HPMS]: {
    y: MtoCommonSolutionKey.HPMS,
    categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
    acronym: 'HPMS',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Health Plan Management System',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.IPC]: {
    key: MtoCommonSolutionKey.IPC,
    categories: [
      MtoCommonSolutionSubject.CONTRACT_VEHICLES,
      MtoCommonSolutionSubject.PAYMENTS_AND_FINANCIALS
    ],
    acronym: 'IPC',
    type: MtoSolutionType.CONTRACTOR,
    name: 'Innovation Payment Contractor',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.ISP]: {
    key: MtoCommonSolutionKey.ISP,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS,
      MtoCommonSolutionSubject.CONTRACT_VEHICLES
    ],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'ISP',
    type: MtoSolutionType.CONTRACTOR,
    name: 'Innovation Support Platform',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.IDR]: {
    key: MtoCommonSolutionKey.IDR,
    categories: [MtoCommonSolutionSubject.DATA],
    acronym: 'IDR',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Integrated Data Repository',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.LDG]: {
    key: MtoCommonSolutionKey.LDG,
    categories: [MtoCommonSolutionSubject.LEARNING],
    acronym: 'LDG',
    type: MtoSolutionType.CROSS_CUTTING_GROUP,
    name: 'Learning and Diffusion Group',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.LV]: {
    key: MtoCommonSolutionKey.LV,
    categories: [MtoCommonSolutionSubject.LEGAL],
    acronym: 'LV',
    type: MtoSolutionType.OTHER,
    name: 'Legal Vertical',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.MDM_POR]: {
    key: MtoCommonSolutionKey.MDM_POR,
    categories: [MtoCommonSolutionSubject.DATA],
    acronym: 'MDM-POR',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Master Data Management Program-Organization Relationship',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.MDM_NCBP]: {
    key: MtoCommonSolutionKey.MDM_NCBP,
    categories: [
      MtoCommonSolutionSubject.DATA,
      MtoCommonSolutionSubject.PAYMENTS_AND_FINANCIALS
    ],
    acronym: 'MDM-NCBP',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Master Data Management for Non-Claims Based Payments',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.MIDS]: {
    key: MtoCommonSolutionKey.MIDS,
    categories: [
      MtoCommonSolutionSubject.CONTRACT_VEHICLES,
      MtoCommonSolutionSubject.QUALITY
    ],
    acronym: 'MIDS',
    type: MtoSolutionType.CONTRACTOR,
    name: 'Measure and Instrument Development and Support',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.MARX]: {
    key: MtoCommonSolutionKey.MARX,
    categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
    acronym: 'MARx',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Medicare Advantage Prescription Drug System',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.MODEL_SPACE]: {
    key: MtoCommonSolutionKey.MODEL_SPACE,
    categories: [MtoCommonSolutionSubject.DATA],
    name: 'Model Space',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.OUTLOOK_MAILBOX]: {
    key: MtoCommonSolutionKey.OUTLOOK_MAILBOX,
    categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK],
    subCategories: [OperationalSolutionSubCategories.COMMUNICATION_TOOLS],
    name: 'Outlook Mailbox',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <OutlookMailboxTimeLine {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.QV]: {
    key: MtoCommonSolutionKey.QV,
    categories: [MtoCommonSolutionSubject.QUALITY],
    acronym: 'QV',
    type: MtoSolutionType.OTHER,
    name: 'Quality Vertical',
    components: {
      timeline: (props: SolutionDetailProps) => <GenericTimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.RMADA]: {
    key: MtoCommonSolutionKey.RMADA,
    categories: [MtoCommonSolutionSubject.CONTRACT_VEHICLES],
    acronym: 'RMADA',
    type: MtoSolutionType.CONTRACTOR,
    name: 'Research, Measurement, Assessment, Design, and Analysis',
    components: {
      timeline: (props: SolutionDetailProps) => <RMADATimeline {...props} />
    }
  },
  [MtoCommonSolutionKey.ARS]: {
    key: MtoCommonSolutionKey.ARS,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS
    ],
    subCategories: [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
    ],
    acronym: 'ARS',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Salesforce Application Review and Scoring',
    components: {
      timeline: (props: SolutionDetailProps) => (
        <SalesforceApplicationReviewTimeline {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.CONNECT]: {
    key: MtoCommonSolutionKey.CONNECT,
    categories: [MtoCommonSolutionSubject.LEARNING],
    name: 'Salesforce CONNECT',
    acronym: 'CONNECT',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        // Timeline is the same as 4Innovation
        <SalesforceApplicationReviewTimeline
          solution={{ key: 'ars' } as HelpSolutionType}
        />
      )
    }
  },
  [MtoCommonSolutionKey.LOI]: {
    key: MtoCommonSolutionKey.LOI,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS
    ],
    subCategories: [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
    ],
    acronym: 'LOI',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Salesforce Letter of Intent',
    components: {
      timeline: (props: SolutionDetailProps) => (
        // Timeline is the same as 4Innovation
        <SalesforceApplicationReviewTimeline
          solution={{ key: 'ars' } as HelpSolutionType}
        />
      )
    }
  },
  [MtoCommonSolutionKey.POST_PORTAL]: {
    key: MtoCommonSolutionKey.POST_PORTAL,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS
    ],
    subCategories: [OperationalSolutionSubCategories.PARTICIPANT_INTERACTION],
    acronym: 'POST / PORTAL',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Salesforce Project Officer Support Tool / Portal',
    components: {
      timeline: (props: SolutionDetailProps) => (
        // Timeline is the same as 4Innovation
        <SalesforceApplicationReviewTimeline
          solution={{ key: 'ars' } as HelpSolutionType}
        />
      )
    }
  },
  [MtoCommonSolutionKey.RFA]: {
    key: MtoCommonSolutionKey.RFA,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS
    ],
    subCategories: [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS
    ],
    acronym: 'RFA',
    type: MtoSolutionType.IT_SYSTEM,
    name: 'Salesforce Request for Application',
    components: {
      timeline: (props: SolutionDetailProps) => (
        // Timeline is the same as 4Innovation
        <SalesforceApplicationReviewTimeline
          solution={{ key: 'ars' } as HelpSolutionType}
        />
      )
    }
  },
  [MtoCommonSolutionKey.SHARED_SYSTEMS]: {
    key: MtoCommonSolutionKey.SHARED_SYSTEMS,
    categories: [MtoCommonSolutionSubject.MEDICARE_FEE_FOR_SERVICE],
    name: 'Shared Systems',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <SharedSystemsTimeLine {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.RREG]: {
    key: MtoCommonSolutionKey.RREG,
    categories: [MtoCommonSolutionSubject.EVALUATION_AND_REVIEW],
    name: 'Research and Rapid Cycle Evaluation Group',
    acronym: 'RREG',
    type: MtoSolutionType.CROSS_CUTTING_GROUP,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.FFRDC]: {
    key: MtoCommonSolutionKey.FFRDC,
    categories: [MtoCommonSolutionSubject.CONTRACT_VEHICLES],
    name: 'Federal Funded Research and Development Center',
    acronym: 'FFRDC',
    type: MtoSolutionType.CONTRACTOR,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.ARDS]: {
    key: MtoCommonSolutionKey.ARDS,
    categories: [MtoCommonSolutionSubject.CONTRACT_VEHICLES],
    name: 'Actuarial Research and Development Services',
    acronym: 'ARDS',
    type: MtoSolutionType.CONTRACTOR,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.T_MISS]: {
    key: MtoCommonSolutionKey.T_MISS,
    categories: [MtoCommonSolutionSubject.DATA],
    name: 'Transformed Medicaid Statistical Information System',
    acronym: 'T-MSIS',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.EPPE]: {
    key: MtoCommonSolutionKey.EPPE,
    categories: [MtoCommonSolutionSubject.DATA],
    name: 'Enterprise Privacy Policy Engine Cloud',
    acronym: 'EPPE',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.DSEP]: {
    key: MtoCommonSolutionKey.DSEP,
    categories: [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK],
    name: 'Division of Stakeholder Engagement and Policy',
    acronym: 'DSEP',
    type: MtoSolutionType.OTHER,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.AMS]: {
    key: MtoCommonSolutionKey.AMS,
    categories: [MtoCommonSolutionSubject.DATA],
    name: 'CMMI Analysis and Management System',
    acronym: 'AMS',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.IC_LANDING]: {
    key: MtoCommonSolutionKey.IC_LANDING,
    categories: [
      MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS
    ],
    name: 'Innovation Center Landing Page',
    acronym: 'IC Landing',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.RASS]: {
    key: MtoCommonSolutionKey.RASS,
    categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
    name: 'Risk Adjustment Suite of Systems',
    acronym: 'RASS',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.DDPS]: {
    key: MtoCommonSolutionKey.DDPS,
    categories: [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D],
    name: 'Drug Data Processing System',
    acronym: 'DDPS',
    type: MtoSolutionType.IT_SYSTEM,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.OACT]: {
    key: MtoCommonSolutionKey.OACT,
    categories: [MtoCommonSolutionSubject.EVALUATION_AND_REVIEW],
    name: 'Office of the Actuary',
    acronym: 'OACT',
    type: MtoSolutionType.OTHER,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.QPP]: {
    key: MtoCommonSolutionKey.QPP,
    categories: [MtoCommonSolutionSubject.QUALITY],
    name: 'Quality Payment Program',
    acronym: 'QPP',
    type: MtoSolutionType.OTHER,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  },
  [MtoCommonSolutionKey.PAM]: {
    key: MtoCommonSolutionKey.PAM,
    categories: [
      MtoCommonSolutionSubject.QUALITY,
      MtoCommonSolutionSubject.CONTRACT_VEHICLES
    ],
    name: 'Patient Activation Measure',
    acronym: 'PAM',
    type: MtoSolutionType.CONTRACTOR,
    components: {
      timeline: (props: SolutionDetailProps) => (
        <GatheringInfoAlert {...props} />
      )
    }
  }
};

export const OperationalSolutionCategories: Record<
  MtoCommonSolutionSubject,
  string
> = {
  [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS]:
    'applications-and-participation-interaction-aco-and-kidney',
  [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS]:
    'applications-and-participation-interaction-non-aco',
  [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK]:
    'communication-tools-and-help-desk',
  [MtoCommonSolutionSubject.CONTRACT_VEHICLES]: 'contract-vehicles',
  [MtoCommonSolutionSubject.DATA]: 'data',
  [MtoCommonSolutionSubject.EVALUATION_AND_REVIEW]: 'evaluation-and-review',
  [MtoCommonSolutionSubject.LEARNING]: 'learning',
  [MtoCommonSolutionSubject.LEGAL]: 'legal',
  [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D]:
    'medicare-advantage-and-part-d',
  [MtoCommonSolutionSubject.MEDICARE_FEE_FOR_SERVICE]:
    'medicare-fee-for-service',
  [MtoCommonSolutionSubject.PAYMENTS_AND_FINANCIALS]: 'payments-and-financials',
  [MtoCommonSolutionSubject.QUALITY]: 'quality'
};

export const OperationSolutionType: Record<MtoSolutionType, string> = {
  [MtoSolutionType.CONTRACTOR]: 'Contracts and contractors',
  [MtoSolutionType.CROSS_CUTTING_GROUP]: 'Cross-cutting group',
  [MtoSolutionType.IT_SYSTEM]: 'IT system',
  [MtoSolutionType.OTHER]: 'Other'
};

export const operationalSolutionSubCategoryMap: Record<
  MtoCommonSolutionSubject,
  OperationalSolutionSubCategories[] | null
> = {
  [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS]:
    [
      OperationalSolutionSubCategories.APPLICATIONS,
      OperationalSolutionSubCategories.PARTICIPANT_INTERACTION
    ],
  [MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS]:
    [
      OperationalSolutionSubCategories.COOPERATIVE_AGREEMENT_APPS,
      OperationalSolutionSubCategories.PARTICIPANT_AGREEMENT_APPS,
      OperationalSolutionSubCategories.PARTICIPANT_INTERACTION
    ],
  [MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK]: [
    OperationalSolutionSubCategories.COMMUNICATION_TOOLS,
    OperationalSolutionSubCategories.HELP_DESK
  ],
  [MtoCommonSolutionSubject.CONTRACT_VEHICLES]: null,
  [MtoCommonSolutionSubject.DATA]: null,
  [MtoCommonSolutionSubject.EVALUATION_AND_REVIEW]: null,
  [MtoCommonSolutionSubject.LEARNING]: null,
  [MtoCommonSolutionSubject.LEGAL]: null,
  [MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D]: null,
  [MtoCommonSolutionSubject.MEDICARE_FEE_FOR_SERVICE]: null,
  [MtoCommonSolutionSubject.PAYMENTS_AND_FINANCIALS]: null,
  [MtoCommonSolutionSubject.QUALITY]: null
};

export const routeToEnumMap: Record<string, MtoCommonSolutionKey> = {
  '4-innovation': MtoCommonSolutionKey.INNOVATION,
  'accountable-care-organization': MtoCommonSolutionKey.ACO_OS,
  'automated-plan-payment-system': MtoCommonSolutionKey.APPS,
  'beneficiary-claims-data-api': MtoCommonSolutionKey.BCDA,
  'centralized-data-exchange': MtoCommonSolutionKey.CDX,
  'chronic-conditions-warehouse': MtoCommonSolutionKey.CCW,
  'cmmi-data-aggregation-contract': MtoCommonSolutionKey.CDAC,
  'cms-box': MtoCommonSolutionKey.CMS_BOX,
  'cms-qualtrics': MtoCommonSolutionKey.CMS_QUALTRICS,
  'consolidated-business-operations-support-center': MtoCommonSolutionKey.CBOSC,
  'cpi-vetting': MtoCommonSolutionKey.CPI_VETTING,
  'electronic-file-transfer': MtoCommonSolutionKey.EFT,
  'expanded-data-feedback-reporting': MtoCommonSolutionKey.EDFR,
  'gov-delivery': MtoCommonSolutionKey.GOVDELIVERY,
  'grant-solutions': MtoCommonSolutionKey.GS,
  'healthcare-integrated-general-kedger-accounting-system':
    MtoCommonSolutionKey.HIGLAS,
  'health-data-reporting': MtoCommonSolutionKey.HDR,
  'health-plan-management-system': MtoCommonSolutionKey.HPMS,
  'innovation-payment-contract': MtoCommonSolutionKey.IPC,
  'innovation-support-platform': MtoCommonSolutionKey.ISP,
  'integrated-data-repository': MtoCommonSolutionKey.IDR,
  'learning-and-diffusion-group': MtoCommonSolutionKey.LDG,
  'legal-vertical': MtoCommonSolutionKey.LV,
  'master-data-management-program-organization-relationship':
    MtoCommonSolutionKey.MDM_POR,
  'master-data-management-for-ncbp': MtoCommonSolutionKey.MDM_NCBP,
  'measure-and-instrument-development-and-support': MtoCommonSolutionKey.MIDS,
  'medicare-advantage-prescription-drug-system': MtoCommonSolutionKey.MARX,
  'model-space': MtoCommonSolutionKey.MODEL_SPACE,
  'outlook-mailbox': MtoCommonSolutionKey.OUTLOOK_MAILBOX,
  'quality-vertical': MtoCommonSolutionKey.QV,
  'research-measurement-assessment-design-and-analysis':
    MtoCommonSolutionKey.RMADA,
  'salesforce-application-review-and-scoring': MtoCommonSolutionKey.ARS,
  'salesforce-connect': MtoCommonSolutionKey.CONNECT,
  'salesforce-letter-of-intent': MtoCommonSolutionKey.LOI,
  'salesforce-project-officer-support-tool-portal':
    MtoCommonSolutionKey.POST_PORTAL,
  'salesforce-request-for-application': MtoCommonSolutionKey.RFA,
  'shared-systems': MtoCommonSolutionKey.SHARED_SYSTEMS,
  'research-and-rapid-cycle-evaluation-group': MtoCommonSolutionKey.RREG,
  'federally-funded-research-and-development-center':
    MtoCommonSolutionKey.FFRDC,
  'actuarial-research-and-design-services': MtoCommonSolutionKey.ARDS,
  'transformed-medicaid-statistical-information-system':
    MtoCommonSolutionKey.T_MISS,
  'enterprise-privacy-policy-engine': MtoCommonSolutionKey.EPPE,
  'division-of-stakeholder-engagement-and-policy': MtoCommonSolutionKey.DSEP,
  'cmmi-analysis-and-management-system': MtoCommonSolutionKey.AMS,
  'innovation-center-landing-page': MtoCommonSolutionKey.IC_LANDING,
  'risk-adjustment-suite-of-systems': MtoCommonSolutionKey.RASS,
  'drug-data-processing-system': MtoCommonSolutionKey.DDPS,
  'office-of-the-actuary': MtoCommonSolutionKey.OACT,
  'quality-payment-program': MtoCommonSolutionKey.QPP,
  'patient-activation-measure': MtoCommonSolutionKey.PAM
};

export const solutionHelpRoute: string =
  '/help-and-knowledge/operational-solutions';

// Operational Solution categories
export const operationalSolutionCategoryMap: Record<
  OperationalSolutionCategoryRoute,
  MtoCommonSolutionSubject
> = {
  'applications-and-participation-interaction-aco-and-kidney':
    MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_ACO_AND_KIDNEY_MODELS,
  'applications-and-participation-interaction-non-aco':
    MtoCommonSolutionSubject.APPLICATIONS_AND_PARTICIPANT_INTERACTION_NON_ACO_MODELS,
  'communication-tools-and-help-desk':
    MtoCommonSolutionSubject.COMMUNICATION_TOOLS_AND_HELP_DESK,
  'contract-vehicles': MtoCommonSolutionSubject.CONTRACT_VEHICLES,
  data: MtoCommonSolutionSubject.DATA,
  'evaluation-and-review': MtoCommonSolutionSubject.EVALUATION_AND_REVIEW,
  learning: MtoCommonSolutionSubject.LEARNING,
  legal: MtoCommonSolutionSubject.LEGAL,
  'medicare-advantage-and-part-d':
    MtoCommonSolutionSubject.MEDICARE_ADVANTAGE_AND_PART_D,
  'medicare-fee-for-service': MtoCommonSolutionSubject.MEDICARE_FEE_FOR_SERVICE,
  'payments-and-financials': MtoCommonSolutionSubject.PAYMENTS_AND_FINANCIALS,
  quality: MtoCommonSolutionSubject.QUALITY
};
