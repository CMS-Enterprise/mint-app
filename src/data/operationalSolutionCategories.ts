enum OperationalSolutionCategories {
  APPLICATIONS_ACO = 'applications-and-participation-interaction-aco-and-kidney',
  APPLICATIONS_NON_ACO = 'applications-and-participation-interaction-non-aco',
  COMMUNICATION_TOOLS = 'communication-tools-and-help-desk',
  CONTRACT_VEHICLES = 'contract-vehicles',
  DATA = 'data',
  LEARNING = 'learning',
  LEGAL = 'legal',
  MEDICARE_ADVANTAGE_D = 'medicare-advantage-and-part-d',
  MEDICARE_FFS = 'medicare-fee-for-service',
  PAYMENT_FINANCIALS = 'payments-and-financials',
  QUALITY = 'quality'
}

export type OperationalSolutionCategoryRoute =
  | 'applications-and-participation-interaction-aco-and-kidney'
  | 'applications-and-participation-interaction-non-aco'
  | 'communication-tools-and-help-desk'
  | 'contract-vehicles'
  | 'data'
  | 'learning'
  | 'legal'
  | 'medicare-advantage-and-part-d'
  | 'medicare-fee-for-service'
  | 'payments-and-financials'
  | 'quality';

export default OperationalSolutionCategories;
