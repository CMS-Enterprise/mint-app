import { TableName } from 'gql/generated/graphql';

import { ChangeRecordType } from '../../util';

// Relevant values refer to TableName in the gql schema
export enum TypeOfChange {
  ALL_MODEL_PLAN_SECTIONS = 'all_model_plan_sections',
  MODEL_TIMELINE = 'plan_timeline',
  BASICS = 'plan_basics',
  GENERAL_CHARACTERISTICS = 'plan_general_characteristics',
  PARTICIPANTS_AND_PROVIDERS = 'plan_participants_and_providers',
  BENEFICIARIES = 'plan_beneficiaries',
  OPERATIONS_EVALUATION_AND_LEARNING = 'plan_ops_eval_and_learning',
  PAYMENTS = 'plan_payments',
  MODEL_TO_OPERATIONS = 'model_to_operations'
}

// Relevant values refer to TableName in the gql schema
export enum TypeOfOtherChange {
  DATA_EXCHANGE_APPROACH = 'data_exchange_approach',
  DISCUSSIONS = 'discussions',
  DOCUMENTS = 'documents',
  OVERALL_STATUS = 'overall_status',
  TEAM_MEMBERS = 'plan_collaborator'
}

export const modelPlanTables: Record<TypeOfChange, TableName | string> = {
  all_model_plan_sections: 'all_model_plan_sections',
  plan_timeline: TableName.PLAN_TIMELINE,
  plan_basics: TableName.PLAN_BASICS,
  plan_general_characteristics: TableName.PLAN_GENERAL_CHARACTERISTICS,
  plan_participants_and_providers: TableName.PLAN_PARTICIPANTS_AND_PROVIDERS,
  plan_beneficiaries: TableName.PLAN_BENEFICIARIES,
  plan_ops_eval_and_learning: TableName.PLAN_OPS_EVAL_AND_LEARNING,
  plan_payments: TableName.PLAN_PAYMENTS,
  model_to_operations: 'model_to_operations'
};

export const otherChangeTables: Record<TypeOfOtherChange, TableName | string> =
  {
    data_exchange_approach: TableName.PLAN_DATA_EXCHANGE_APPROACH,
    discussions: TableName.PLAN_DISCUSSION,
    documents: TableName.PLAN_DOCUMENT,
    overall_status: 'overall_status',
    plan_collaborator: TableName.PLAN_COLLABORATOR
  };

export const mtoTables: TableName[] = [
  TableName.MTO_CATEGORY,
  TableName.MTO_INFO,
  TableName.MTO_MILESTONE,
  TableName.MTO_MILESTONE_SOLUTION_LINK,
  TableName.MTO_SOLUTION
];

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

// Filter audits between a start and end date if present
export const filterAuditsBetweenDates = (
  groupedAudits: ChangeRecordType[][],
  startDate?: string, // ISO string
  endDate?: string // ISO string
): ChangeRecordType[][] => {
  // If no start or end date is provided, return all audits
  if (!startDate && !endDate) {
    return groupedAudits;
  }

  // If start or end date is provided, filter audits by date
  return groupedAudits.filter(audits => {
    const filteredAudits = audits.filter(audit => {
      if (startDate && endDate) {
        if (audit.date >= startDate && audit.date <= endDate) {
          return true;
        }
      } else if (startDate) {
        if (audit.date >= startDate) {
          return true;
        }
      } else if (endDate) {
        if (audit.date <= endDate) {
          return true;
        }
      }
      return false;
    });

    if (filteredAudits.length > 0) {
      return true;
    }
    return false;
  });
};

export default getAllContributors;
