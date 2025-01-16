import { TranslationMTOSolutionCustom } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const mtoSolution: TranslationMTOSolutionCustom = {
  solutionType: {
    gqlField: 'solutionType',
    goField: 'SolutionType',
    dbField: 'type',
    label: 'Milestone title',
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
    label: 'Milestone title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.1
  },
  pocName: {
    gqlField: 'pocName',
    goField: 'PocName',
    dbField: 'poc_name',
    label: 'Milestone title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.2
  },
  pocEmail: {
    gqlField: 'pocEmail',
    goField: 'PocEmail',
    dbField: 'poc_email',
    label: 'Milestone title',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.3
  },
  status: {
    gqlField: 'status',
    goField: 'Status',
    dbField: 'status',
    label: 'Status',
    dataType: TranslationDataType.ENUM,
    formType: TranslationFormType.RADIO,
    options: {
      NOT_STARTED: 'Not started',
      ONBOARDING: 'Onboarding',
      BACKLOG: 'Backlog',
      IN_PROGRESS: 'In Progress',
      COMPLETED: 'Completed'
    },
    order: 1.4
  }
};

export default mtoSolution;
