/*
  Typed translation mappings for question centric architecture for a model plan
  Used to dynamically iterate/render questions, answers for functionality such as csv export and change history
*/

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

// Extended type for questions that have options - boolean, radio, checkbox, etc.
export type TranslationFieldPropertiesWithOptions = TranslationFieldProperties & {
  options: Record<string, string>;
};

export type TranslationFieldPropertiesWithOptionsAndTooltip = TranslationFieldPropertiesWithOptions & {
  tooltip: Record<string, string>;
};

// Model Plan
export type TranslationModelPlan = {
  modelName: TranslationFieldProperties;
  previousName: TranslationFieldProperties;
  abbreviation: TranslationFieldProperties;
};

// Plan Basics
export type TranslationPlanBasics = {
  // Model Plan
  amsModelID: TranslationFieldProperties;
  demoCode: TranslationFieldProperties;
  modelCategory: TranslationFieldPropertiesWithOptionsAndTooltip;
  additionalModelCategories: TranslationFieldProperties;
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

export type TranslationPlan = {
  modelPlan: TranslationModelPlan;
  planBasics: TranslationPlanBasics;
};
