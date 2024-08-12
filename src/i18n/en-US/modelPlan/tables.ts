import { EnumTranslation, TableName } from '../../../gql/gen/graphql';

export const tables: Record<TableName, Omit<EnumTranslation, '__typename'>> = {
  [TableName.ACTIVITY]: { generalName: 'Activities' },
  [TableName.ANALYZED_AUDIT]: { generalName: 'Analyzed audits' },
  [TableName.DISCUSSION_REPLY]: {
    generalName: 'Replies',
    groupedName: 'Discussions'
  },
  [TableName.EXISTING_MODEL]: { generalName: 'Existing models' },
  [TableName.EXISTING_MODEL_LINK]: {
    generalName: 'Existing model links',
    groupedName: 'General characteristics'
  },
  [TableName.MODEL_PLAN]: { generalName: 'Model plan' },
  [TableName.NDA_AGREEMENT]: { generalName: 'NDA agreements' },
  [TableName.OPERATIONAL_NEED]: {
    generalName: 'Operational needs',
    groupedName: 'Operational solutions and implementation status tracker'
  },
  [TableName.OPERATIONAL_SOLUTION]: {
    generalName: 'Operational solutions',
    groupedName: 'Operational solutions and implementation status tracker'
  },
  [TableName.OPERATIONAL_SOLUTION_SUBTASK]: {
    generalName: 'Operational solution subtasks',
    groupedName: 'Operational solutions and implementation status tracker'
  },
  [TableName.PLAN_BASICS]: { generalName: 'Model basics' },
  [TableName.PLAN_BENEFICIARIES]: { generalName: 'Beneficiaries' },
  [TableName.PLAN_COLLABORATOR]: { generalName: 'Model team' },
  [TableName.PLAN_CR]: { generalName: 'CRs', groupedName: 'FFS CRs and TDLs' },
  [TableName.PLAN_DISCUSSION]: { generalName: 'Discussions' },
  [TableName.PLAN_DOCUMENT]: { generalName: 'Documents' },
  [TableName.PLAN_DOCUMENT_SOLUTION_LINK]: {
    generalName: 'Document solution links',
    groupedName: 'Operational solutions and implementation status tracker'
  },
  [TableName.PLAN_FAVORITE]: { generalName: 'Favorites' },
  [TableName.PLAN_GENERAL_CHARACTERISTICS]: {
    generalName: 'General characteristics'
  },
  [TableName.PLAN_OPS_EVAL_AND_LEARNING]: {
    generalName: 'Operations, evaluation, and learning'
  },
  [TableName.PLAN_PARTICIPANTS_AND_PROVIDERS]: {
    generalName: 'Participants and providers'
  },
  [TableName.PLAN_PAYMENTS]: { generalName: 'Payments' },
  [TableName.PLAN_TDL]: {
    generalName: 'TDLs',
    groupedName: 'FFS CRs and TDLs'
  },
  [TableName.POSSIBLE_NEED_SOLUTION_LINK]: {
    generalName: 'Possible need solution links'
  },
  [TableName.POSSIBLE_OPERATIONAL_NEED]: {
    generalName: 'Possible operational needs',
    groupedName: 'Operational solutions and implementation status tracker'
  },
  [TableName.POSSIBLE_OPERATIONAL_SOLUTION]: {
    generalName: 'Possible operational solutions',
    groupedName: 'Operational solutions and implementation status tracker'
  },
  [TableName.POSSIBLE_OPERATIONAL_SOLUTION_CONTACT]: {
    generalName: 'Possible Operational Solution Contact'
  },
  [TableName.TAG]: { generalName: 'Tags' },
  [TableName.TRANSLATED_AUDIT]: { generalName: 'Translated audits' },
  [TableName.TRANSLATED_AUDIT_FIELD]: {
    generalName: 'Translated audit fields'
  },
  [TableName.TRANSLATED_AUDIT_QUEUE]: {
    generalName: 'Translated audit queues'
  },
  [TableName.USER_ACCOUNT]: { generalName: 'User accounts' },
  [TableName.USER_NOTIFICATION]: { generalName: 'User notifications' },
  [TableName.USER_NOTIFICATION_PREFERENCES]: {
    generalName: 'User notification preferences'
  },
  [TableName.USER_VIEW_CUSTOMIZATION]: {
    generalName: 'User view customizations'
  }
};

export default tables;
