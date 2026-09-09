import {
  DataExchangeApproachStatus,
  GetCollaborationAreaQuery,
  IddocQuestionnaireTaskListStatus
} from 'gql/generated/graphql';

export type QuestionnairesType =
  GetCollaborationAreaQuery['modelPlan']['questionnaires'];

export type Questionnaire = Omit<
  QuestionnairesType,
  '__typename'
>[QuestionnaireName];

export type QuestionnaireName = keyof Omit<QuestionnairesType, '__typename'>;

export type QuestionnairesStatusType =
  | DataExchangeApproachStatus
  | IddocQuestionnaireTaskListStatus;
