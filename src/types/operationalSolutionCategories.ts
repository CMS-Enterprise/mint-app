export enum OperationalSolutionSubCategories {
  APPLICATIONS = 'APPLICATIONS',
  PARTICIPANT_INTERACTION = 'PARTICIPANT_INTERACTION',
  COOPERATIVE_AGREEMENT_APPS = 'COOPERATIVE_AGREEMENT_APPS',
  PARTICIPANT_AGREEMENT_APPS = 'PARTICIPANT_AGREEMENT_APPS',
  COMMUNICATION_TOOLS = 'COMMUNICATION_TOOLS',
  HELP_DESK = 'HELP_DESK'
}

export type OperationalSolutionCategoryRoute =
  | 'applications-and-participation-interaction-aco-and-kidney'
  | 'applications-and-participation-interaction-non-aco'
  | 'communication-tools-and-help-desk'
  | 'contract-vehicles'
  | 'data'
  | 'evaluation-and-review'
  | 'learning'
  | 'legal'
  | 'medicare-advantage-and-part-d'
  | 'medicare-fee-for-service'
  | 'payments-and-financials'
  | 'quality';
