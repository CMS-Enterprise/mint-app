import { isTranslationFieldPropertiesWithOptions } from 'types/translation';
import dirtyInput from 'utils/formUtil';

import {
  CombinedConfigType,
  ModelPlanQuestionsDataType,
  QuestionType
} from './_components/ModelPlanQuestionsForm';

export const formattedValue = (
  combinedConfig: CombinedConfigType,
  key: keyof typeof combinedConfig,
  rawValue: unknown
) => {
  if (rawValue === null || rawValue === undefined) {
    return '';
  }

  const config = combinedConfig[key];

  if (isTranslationFieldPropertiesWithOptions(config)) {
    if (Array.isArray(rawValue)) {
      return rawValue
        .map(value => config.options[value as keyof typeof config.options])
        .join(', ');
    }
    return config.options[rawValue as keyof typeof config.options];
  }
  return String(rawValue);
};

export const getChildrenQuestions = (
  questionConfig: QuestionType,
  liveFormData: ModelPlanQuestionsDataType
) => {
  const childrenQuestionsConfig = questionConfig.childRelation?.filter(
    childQuestion => {
      if (
        childQuestion.field === 'resemblesExistingModelWhich' ||
        childQuestion.field === 'participationInModelPreconditionWhich'
      ) {
        return (liveFormData[childQuestion.field]?.links?.length ?? 0) > 0;
      }

      const value = liveFormData[childQuestion.field];

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== null && value !== undefined && value !== '';
    }
  );
  return childrenQuestionsConfig
    ? childrenQuestionsConfig.map(child => child.field)
    : [];
};

const getBasicsFormData = (data: ModelPlanQuestionsDataType) => {
  return {
    modelCategory: data.modelCategory,
    additionalModelCategories: data.additionalModelCategories,
    cmsCenters: data.cmsCenters,
    cmmiGroups: data.cmmiGroups
  };
};

const getGeneralCharacteristicsFormData = (
  data: ModelPlanQuestionsDataType
) => {
  const {
    modelCategory,
    additionalModelCategories,
    cmsCenters,
    cmmiGroups,
    ...generalCharacteristics
  } = data;
  return generalCharacteristics;
};

export const getFormDiffs = (
  initialValues: ModelPlanQuestionsDataType,
  currentValues: ModelPlanQuestionsDataType
) => {
  const initialBasics = getBasicsFormData(initialValues);
  const currentBasics = getBasicsFormData(currentValues);
  const basicsChanges = dirtyInput(initialBasics, currentBasics);

  const initialGeneral = getGeneralCharacteristicsFormData(initialValues);
  const currentGeneral = getGeneralCharacteristicsFormData(currentValues);
  const generalCharacteristicsChanges = dirtyInput(
    initialGeneral,
    currentGeneral
  );

  delete generalCharacteristicsChanges.existingModel;

  // const allChangedFields = dirtyInput(initialValues, currentValues);

  // Process Link Data
  // const withResemblesLinks = 'resemblesExistingModelLinks' in allChangedFields;
  // const withParticipationLinks =
  //   'participationInModelPreconditionLinks' in allChangedFields;

  // const resemblesLinks = withResemblesLinks
  //   ? separateLinksByType(
  //       currentValues.resemblesExistingModelLinks || [],
  //       draftModelPlans,
  //       existingModelPlans
  //     )
  //   : { existingModelIDs: [], currentModelPlanIDs: [] };

  // const participationLinks = withParticipationLinks
  //   ? separateLinksByType(
  //       currentValues.participationInModelPreconditionLinks || [],
  //       draftModelPlans,
  //       existingModelPlans
  //     )
  //   : { existingModelIDs: [], currentModelPlanIDs: [] };

  return {
    basicsChanges,
    withBasics: Object.keys(basicsChanges).length > 0,

    generalCharacteristicsChanges,
    withGeneralCharacteristics:
      Object.keys(generalCharacteristicsChanges).length > 0
  };
};
