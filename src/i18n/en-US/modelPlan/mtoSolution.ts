import { TranslationMTOSolutionCustom } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoSolution: TranslationMTOSolutionCustom = {
  solutionType: {
    gqlField: 'solutionType',
    goField: 'SolutionType',
    dbField: 'type',
    label: 'What type of solution is this',
    exportLabel: 'Solution type',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: {
      IT_SYSTEM: 'IT System',
      CONTRACTOR: 'Contract vehicle, contractor, or other contract',
      CROSS_CUTTING_GROUP: 'Cross-cutting group',
      OTHER: 'Other'
    },
    order: 1.0
  },
  name: {
    gqlField: 'name',
    goField: 'Name',
    dbField: 'name',
    label: 'Please add a title for your solution',
    exportLabel: 'Solution name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.1
  },
  pocName: {
    gqlField: 'pocName',
    goField: 'PocName',
    dbField: 'poc_name',
    label: 'Point of contact name',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.2
  },
  pocEmail: {
    gqlField: 'pocEmail',
    goField: 'PocEmail',
    dbField: 'poc_email',
    label: 'Point of contact email address',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.3
  },
  key: {
    gqlField: 'key',
    goField: 'Key',
    dbField: 'mto_common_solution_key',
    label: 'MTO Common Solution',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    tableReference: TableName.MTO_COMMON_SOLUTION,
    order: 1.4
  },
  riskIndicator: {
    gqlField: 'riskIndicator',
    goField: 'RiskIndicator',
    dbField: 'risk_indicator',
    label: 'Risk Indicator',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: {
      AT_RISK: 'At risk',
      OFF_TRACK: 'Off track',
      ON_TRACK: 'On track'
    },
    order: 1.5
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.SELECT,
    options: {
      BACKLOG: 'Backlog',
      COMPLETED: 'Completed',
      IN_PROGRESS: 'In progress',
      NOT_STARTED: 'Not started',
      ONBOARDING: 'Onboarding'
    },
    order: 1.6
  },
  neededBy: {
    gqlField: 'neededBy',
    goField: 'NeededBy',
    dbField: 'needed_by',
    label: 'Needed By',
    dataType: TranslationDataType.DATE,
    formType: TranslationFormType.TEXT,
    order: 1.7
  },
  facilitatedBy: {
    gqlField: 'facilitatedBy',
    goField: 'FacilitatedBy',
    dbField: 'facilitated_by',
    label: 'Facilitated By',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.MULTISELECT,
    options: {
      APPLICATION_SUPPORT_CONTRACTOR: 'Application support contractor',
      CONTRACTING_OFFICERS_REPRESENTATIVE:
        'Contracting officers representative',
      EVALUATION_CONTRACTOR: 'Evaluation contractor',
      IMPLEMENTATION_CONTRACTOR: 'Implementation contractor',
      IT_LEAD: 'It lead',
      IT_SYSTEM_TEAM_OR_PRODUCT_OWNER: 'It system team or product owner',
      LEARNING_AND_DIFFUSION_GROUP: 'Learning and diffusion group',
      LEARNING_CONTRACTOR: 'Learning contractor',
      MODEL_LEAD: 'Model lead',
      MODEL_TEAM: 'Model team',
      MONITORING_CONTRACTOR: 'Monitoring contractor',
      OTHER: 'Other',
      PARTICIPANTS: 'Participants',
      QUALITY_MEASURES_DEVELOPMENT_CONTRACTOR:
        'Quality measures development contractor',
      RESEARCH_AND_RAPID_CYCLE_EVALUATION_GROUP:
        'Research and rapid cycle evaluation group',
      SOLUTION_ARCHITECT: 'Solution architect'
    },
    order: 1.8
  }
};

export default mtoSolution;
