/*
  Typed translation mappings for question centric architecture for a model plan
  Used to dynamically iterate/render questions, answers for functionality such as csv export and change history
*/
import { FilterGroup } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';

import {
  AlternativePaymentModelType,
  CMMIGroup,
  CMSCenter,
  KeyCharacteristic,
  ModelCategory,
  ModelType,
  TaskStatus
} from './graphql-global-types';

export enum Bool {
  true = 'true',
  false = 'false'
}

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
// Takes in a enum parameter for translation key
export type TranslationFieldPropertiesWithOptions<
  T extends string
> = TranslationFieldProperties & {
  options: Record<T, string>;
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
  modelCategory: TranslationFieldPropertiesWithOptions<ModelCategory>;
  cmsCenters: TranslationFieldPropertiesWithOptions<CMSCenter>;
  cmmiGroups: TranslationFieldPropertiesWithOptions<CMMIGroup>;
  // Overview
  modelType: TranslationFieldPropertiesWithOptions<ModelType>;
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
  phasedIn: TranslationFieldPropertiesWithOptions<Bool>;
  phasedInNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

// General Characteristics
export type TranslationGeneralCharacteristics = {
  isNewModel: TranslationFieldPropertiesWithOptions<Bool>;
  existingModel: TranslationFieldProperties;
  existingModelLinks: TranslationFieldProperties;
  resemblesExistingModel: TranslationFieldPropertiesWithOptions<Bool>;
  resemblesExistingModelHow: TranslationFieldProperties;
  resemblesExistingModelNote: TranslationFieldProperties;
  hasComponentsOrTracks: TranslationFieldPropertiesWithOptions<Bool>;
  hasComponentsOrTracksDiffer: TranslationFieldProperties;
  hasComponentsOrTracksNote: TranslationFieldProperties;
  // Key Characteristics
  alternativePaymentModelTypes: TranslationFieldPropertiesWithOptions<AlternativePaymentModelType>;
  alternativePaymentModelNote: TranslationFieldProperties;
  keyCharacteristics: TranslationFieldPropertiesWithOptions<KeyCharacteristic>;
  keyCharacteristicsNote: TranslationFieldProperties;
  keyCharacteristicsOther: TranslationFieldProperties;
  collectPlanBids: TranslationFieldPropertiesWithOptions<Bool>;
  collectPlanBidsNote: TranslationFieldProperties;
  managePartCDEnrollment: TranslationFieldPropertiesWithOptions<Bool>;
  managePartCDEnrollmentNote: TranslationFieldProperties;
  planContractUpdated: TranslationFieldPropertiesWithOptions<Bool>;
  planContractUpdatedNote: TranslationFieldProperties;
};

export type TranslationPlan = {
  modelPlan: TranslationModelPlan;
  basics: TranslationBasics;
  generalCharacteristicsT: TranslationGeneralCharacteristics; // TODO: remove T
};
