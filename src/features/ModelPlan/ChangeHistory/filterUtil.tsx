import { ChangeRecordType } from './util';

export enum TypeOfChange {
  ALL_MODEL_PLAN_SECTIONS = 'ALL_MODEL_PLAN_SECTIONS',
  MODEL_TIMELINE = 'MODEL_TIMELINE',
  MODEL_BASICS = 'MODEL_BASICS',
  GENERAL_CHARACTERISTICS = 'GENERAL_CHARACTERISTICS',
  PARTICIPANTS_AND_PROVIDERS = 'PARTICIPANTS_AND_PROVIDERS',
  BENEFICIARIES = 'BENEFICIARIES',
  OPERATIONS_EVALUATION_AND_LEARNING = 'OPERATIONS_EVALUATION_AND_LEARNING',
  PAYMENT = 'PAYMENT',
  MODEL_TO_OPERATIONS = 'MODEL_TO_OPERATIONS'
}

export enum TypeOfOtherChange {
  DATA_EXCHANGE_APPROACH = 'DATA_EXCHANGE_APPROACH',
  DISCUSSIONS = 'DISCUSSIONS',
  DOCUMENTS = 'DOCUMENTS',
  OVERALL_STATUS = 'OVERALL_STATUS',
  TEAM_MEMBERS = 'TEAM_MEMBERS'
}

export const getAllContributors = (
  changes: ChangeRecordType[][],
  collaborators: string[]
) => [
  ...new Set(
    changes
      .flatMap(change => change.map(c => c.actorName))
      .filter(contributor => !collaborators?.includes(contributor))
  )
];

export default getAllContributors;
