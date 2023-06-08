/* eslint-disable camelcase */

export type TranslationFieldProperties = {
  gqlField: string;
  goField: string;
  dbField: string;
  question: string;
  hint?: string;
  dataType: 'string' | 'boolean' | 'date' | 'enum';
  formType:
    | 'text'
    | 'textarea'
    | 'number'
    | 'boolean'
    | 'radio'
    | 'checkbox'
    | 'select'
    | 'multiSelect'
    | 'datePicker'
    | 'rangeInput';
  tags?: string[];
};

export type TranslationFieldPropertiesWithOptions = TranslationFieldProperties & {
  options: Record<string, string>;
};

export type TranslationField =
  | TranslationFieldProperties
  | TranslationFieldPropertiesWithOptions;

export type TranslationModelPlan = {
  modelName: TranslationFieldProperties;
};

export type TranslationPlanBasics = {
  // Model Plan
  modelCategory: TranslationFieldPropertiesWithOptions;
  cmsCenters: TranslationFieldPropertiesWithOptions;
  cmmiGroups: TranslationFieldPropertiesWithOptions;
  // Overview
  modelType: TranslationFieldPropertiesWithOptions;
  problem: TranslationFieldProperties;
  goal: TranslationFieldProperties;
  testInterventions: TranslationFieldProperties;
  // Milestones
  completeICIP: TranslationFieldProperties;
  clearanceStarts: TranslationFieldProperties;
  clearanceEnds: TranslationFieldProperties;
  announced: TranslationFieldProperties;
  applicationsStart: TranslationFieldProperties;
  applicationsEnd: TranslationFieldProperties;
  performancePeriodStarts: TranslationFieldProperties;
  performancePeriodEnds: TranslationFieldProperties;
  highLevelNote: TranslationFieldProperties;
  wrapUpEnds: TranslationFieldProperties;
  phasedIn: TranslationFieldPropertiesWithOptions;
  phasedInNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions;
};

export type PlanSection =
  | 'model_plan'
  | 'plan_basics'
  | 'plan_general_characteristics'
  | 'plan_participants_and_providers'
  | 'plan_beneficiaries'
  | 'plan_ops_eval_and_learning'
  | 'plan_payments'
  | 'operational_need'
  | 'operational_solution';

export type TranslationPlan = {
  model_plan: TranslationModelPlan;
  plan_basics: TranslationPlanBasics;
};
