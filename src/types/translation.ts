/*
  Typed translation mappings for question centric architecture for a model plan
  Used to dynamically iterate/render questions, answers for functionality such as csv export and change history
*/
import { FilterGroup } from 'views/ModelPlan/ReadOnly/_components/FilterView/BodyContent/_filterGroupMapping';

import {
  AgreementType,
  AlternativePaymentModelType,
  AuthorityAllowance,
  CMMIGroup,
  CMSCenter,
  GeographyApplication,
  GeographyType,
  KeyCharacteristic,
  ModelCategory,
  ModelType,
  TaskStatus,
  WaiverType
} from './graphql-global-types';

// Util used to preserve type defintions when mapping over keys of object
// https://stackoverflow.com/questions/52856496/typescript-object-keys-return-string
export const getKeys = Object.keys as <T extends object>(
  obj: T
) => Array<keyof T>;

export enum Bool {
  true = 'true',
  false = 'false'
}

export type TranslationFieldProperties = {
  gqlField: string;
  goField: string;
  dbField: string;
  question: string;
  readonlyQuestion?: string;
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
  T extends keyof T | string
> = TranslationFieldProperties & {
  options: Record<T, string>;
  optionsLabels?: Record<T, string>;
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
  note: TranslationFieldProperties;
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
  // Involvements
  careCoordinationInvolved: TranslationFieldPropertiesWithOptions<Bool>;
  careCoordinationInvolvedDescription: TranslationFieldProperties;
  careCoordinationInvolvedNote: TranslationFieldProperties;
  additionalServicesInvolved: TranslationFieldPropertiesWithOptions<Bool>;
  additionalServicesInvolvedDescription: TranslationFieldProperties;
  additionalServicesInvolvedNote: TranslationFieldProperties;
  communityPartnersInvolved: TranslationFieldPropertiesWithOptions<Bool>;
  communityPartnersInvolvedDescription: TranslationFieldProperties;
  communityPartnersInvolvedNote: TranslationFieldProperties;
  // Targets and Options
  geographiesTargeted: TranslationFieldPropertiesWithOptions<Bool>;
  geographiesTargetedTypes: TranslationFieldPropertiesWithOptions<GeographyType>;
  geographiesTargetedTypesOther: TranslationFieldProperties;
  geographiesTargetedAppliedTo: TranslationFieldPropertiesWithOptions<GeographyApplication>;
  geographiesTargetedAppliedToOther: TranslationFieldProperties;
  geographiesTargetedNote: TranslationFieldProperties;
  participationOptions: TranslationFieldPropertiesWithOptions<Bool>;
  participationOptionsNote: TranslationFieldProperties;
  agreementTypes: TranslationFieldPropertiesWithOptions<AgreementType>;
  agreementTypesOther: TranslationFieldProperties;
  multiplePatricipationAgreementsNeeded: TranslationFieldPropertiesWithOptions<Bool>;
  multiplePatricipationAgreementsNeededNote: TranslationFieldProperties;
  // Authority
  rulemakingRequired: TranslationFieldPropertiesWithOptions<Bool>;
  rulemakingRequiredDescription: TranslationFieldProperties;
  rulemakingRequiredNote: TranslationFieldProperties;
  authorityAllowances: TranslationFieldPropertiesWithOptions<AuthorityAllowance>;
  authorityAllowancesOther: TranslationFieldProperties;
  authorityAllowancesNote: TranslationFieldProperties;
  waiversRequired: TranslationFieldPropertiesWithOptions<Bool>;
  waiversRequiredTypes: TranslationFieldPropertiesWithOptions<WaiverType>;
  waiversRequiredNote: TranslationFieldProperties;
  status: TranslationFieldPropertiesWithOptions<TaskStatus>;
};

export type TranslationPlan = {
  modelPlan: TranslationModelPlan;
  basics: TranslationBasics;
  generalCharacteristics: TranslationGeneralCharacteristics;
};
