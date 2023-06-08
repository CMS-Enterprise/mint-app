/* eslint-disable */

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
    | 'multiselect'
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
  modelCategory: TranslationFieldPropertiesWithOptions;
  cmsCenters: TranslationFieldPropertiesWithOptions;
  cmmiGroups: TranslationFieldPropertiesWithOptions;
  modelType: TranslationFieldPropertiesWithOptions;
};

export type TranslationPlan = {
  model_plan: TranslationModelPlan;
  plan_basics: TranslationPlanBasics;
};
