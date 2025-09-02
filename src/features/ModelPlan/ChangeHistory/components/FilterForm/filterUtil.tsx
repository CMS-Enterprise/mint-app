import { TableName } from 'gql/generated/graphql';

import {
  ChangeRecordType,
  getActionText,
  getHeaderText,
  getNestedActionText,
  TranslationTables
} from '../../util';

export enum TypeOfChange {
  ALL_MODEL_PLAN_SECTIONS = 'all_model_plan_sections',
  MODEL_TIMELINE = 'model_timeline',
  BASICS = 'plan_basics',
  GENERAL_CHARACTERISTICS = 'plan_general_characteristics',
  PARTICIPANTS_AND_PROVIDERS = 'plan_participants_and_providers',
  BENEFICIARIES = 'plan_beneficiaries',
  OPERATIONS_EVALUATION_AND_LEARNING = 'plan_ops_eval_and_learning',
  PAYMENTS = 'plan_payments',
  MODEL_TO_OPERATIONS = 'model_to_operations'
}

export enum TypeOfOtherChange {
  DATA_EXCHANGE_APPROACH = 'data_exchange_approach',
  DISCUSSIONS = 'discussions',
  DOCUMENTS = 'documents',
  OVERALL_STATUS = 'overall_status',
  TEAM_MEMBERS = 'team_members'
}

export const modelPlanTables: Record<TypeOfChange, TableName | string> = {
  all_model_plan_sections: 'all_model_plan_sections',
  model_timeline: TableName.PLAN_TIMELINE,
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
    team_members: TableName.PLAN_COLLABORATOR
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

export const filterUserAudits = (
  userString: string,
  groupedAudits: ChangeRecordType[][]
): ChangeRecordType[][] => {
  return groupedAudits.filter(audits => {
    const filteredAudits = audits.filter(audit => {
      const lowerCaseQuery = userString.toLowerCase().trim();

      const actionText = getActionText(audit);

      if (actionText.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Gets translated nested action text for fields and checks for a match
      const nestedActionTexts = audit.translatedFields.map(field =>
        getNestedActionText(
          field,
          audit.action,
          audit.tableName as TranslationTables
        )
      );

      if (
        nestedActionTexts.some(text =>
          text.toLowerCase().includes(lowerCaseQuery)
        )
      ) {
        return true;
      }

      // Check for a match on the header text
      if (getHeaderText(audit).toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      // Check for a match on any part of metdata
      const metaDataMatch =
        audit.metaData &&
        Object.values(audit.metaData).find(
          field =>
            typeof field === 'string' &&
            field?.toLowerCase().includes(lowerCaseQuery)
        );

      if (metaDataMatch) return true;

      const translatedFieldsMatchQuery = audit.translatedFields.filter(
        field => {
          if (
            field.fieldNameTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.newTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.oldTranslated?.toLowerCase().includes(lowerCaseQuery) ||
            field.referenceLabel?.toLowerCase().includes(lowerCaseQuery)
          ) {
            return true;
          }

          return false;
        }
      );

      // Check if the actor name matches the query
      if (audit.actorName.toLowerCase().includes(lowerCaseQuery)) {
        return true;
      }

      if (translatedFieldsMatchQuery.length > 0) {
        return true;
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
