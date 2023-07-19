/*
  Typed translation mappings for question centric architecture for a model plan
  Used to dynamically iterate/render questions, answers for functionality such as csv export and change history
*/
import { FilterGroup } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';

export type TranslationFieldProperties = {
  gqlField: string;
  goField: string;
  dbField: string;
  question: string;
  hint?: string;
  multiSelectLabel?: string;
  dataType: 'string' | 'boolean' | 'date' | 'enum';
  isArray?: boolean;
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
  filterGroups?: FilterGroup[]; // Used to render questions within Readonly filter group view (Also CSV/PDF export)
  tags?: string[];
};

// Extended type for questions that have options - boolean, radio, checkbox, etc.
export type TranslationFieldPropertiesWithOptions = TranslationFieldProperties & {
  options: Record<string, string>;
};

// Model Plan
export type TranslationModelPlan = {
  modelName: TranslationFieldProperties;
  previousName: TranslationFieldProperties;
  abbreviation: TranslationFieldProperties;
};

// Basics
export type TranslationBasics = {
  // Model Plan
  amsModelID: TranslationFieldProperties;
  demoCode: TranslationFieldProperties;
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

// General Characteristics
export type TranslationGeneralCharacteristics = {
  isNewModel: TranslationFieldPropertiesWithOptions;
  existingModel: TranslationFieldPropertiesWithOptions;
  existingModelLinks: TranslationFieldProperties;
  resemblesExistingModel: TranslationFieldPropertiesWithOptions;
  resemblesExistingModelHow: TranslationFieldProperties;
  resemblesExistingModelNote: TranslationFieldProperties;
  hasComponentsOrTracks: TranslationFieldPropertiesWithOptions;
  hasComponentsOrTracksDiffer: TranslationFieldProperties;
  hasComponentsOrTracksNote: TranslationFieldProperties;
};

export type TranslationPlan = {
  modelPlan: TranslationModelPlan;
  basics: TranslationBasics;
  generalCharacteristics: TranslationGeneralCharacteristics;
};
