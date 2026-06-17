import {
  CommonWaiverType,
  GetModelPlanQuestionsQuery,
  SuggestedCommonWaiverFragment
} from 'gql/generated/graphql';

import {
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren
} from 'types/translation';
import dirtyInput, { symmetricDifference } from 'utils/formUtil';

import {
  CombinedConfigType,
  ModelPlanQuestionsFormTypeWithLinks
} from './_components/ModelPlanQuestionsForm';
import {
  MULTI_SELECT_WITH_OTHER,
  QuestionFieldType,
  QuestionType
} from './_components/ModelPlanQuestionsForm/questionMap';

/**
 * Maps translation config field
 */
export const getTranslationKey = (key: string): keyof CombinedConfigType => {
  if (key === 'resemblesExistingModelLinks') {
    return 'resemblesExistingModelWhich' as keyof CombinedConfigType;
  }
  if (key === 'participationInModelPreconditionLinks') {
    return 'participationInModelPreconditionWhich' as keyof CombinedConfigType;
  }
  return key as keyof CombinedConfigType;
};

/**
 * Maps form field
 */
export const getFormStateKey = (
  key: string
): keyof ModelPlanQuestionsFormTypeWithLinks => {
  if (key === 'resemblesExistingModelWhich') {
    return 'resemblesExistingModelLinks' as keyof ModelPlanQuestionsFormTypeWithLinks;
  }
  if (key === 'participationInModelPreconditionWhich') {
    return 'participationInModelPreconditionLinks' as keyof ModelPlanQuestionsFormTypeWithLinks;
  }
  return key as keyof ModelPlanQuestionsFormTypeWithLinks;
};

export const formattedLabel = ({
  combinedConfig,
  key
}: {
  combinedConfig: CombinedConfigType;
  key: string;
}) => {
  const translationKey = getTranslationKey(key);

  return combinedConfig[translationKey]?.label || '';
};

export const formattedValue = ({
  combinedConfig,
  key,
  rawValue,
  comboOptions
}: {
  combinedConfig: CombinedConfigType;
  key: string;
  rawValue: unknown;
  comboOptions: { label: string; value: string }[];
}) => {
  if (rawValue === null || rawValue === undefined) {
    return '';
  }

  if (Array.isArray(rawValue) && rawValue.length === 0) return '';

  const valueInArray = Array.isArray(rawValue) ? rawValue : [rawValue];

  const translationKey = getTranslationKey(key);

  const config = combinedConfig[translationKey as keyof typeof combinedConfig];

  const labels = valueInArray.map(val => {
    const valueString = String(val);

    const comboMatch = comboOptions.find(
      option => option.value === valueString
    );

    if (comboMatch) {
      return comboMatch.label;
    }

    if (isTranslationFieldPropertiesWithOptions(config)) {
      const staticLabel =
        config.options[valueString as keyof typeof config.options];

      if (staticLabel) {
        return staticLabel;
      }
    }

    return valueString;
  });

  return labels
    .filter(label => label !== undefined && label !== null && label !== '')
    .sort((a, b) => a.localeCompare(b))
    .join(', ');
};

// This function is used to get children question from questionMap, not translationConfig
export const getMapChildrenQuestions = (
  questionConfig: QuestionType,
  liveFormData: ModelPlanQuestionsFormTypeWithLinks
) => {
  const childrenQuestionsConfig = questionConfig.childRelation?.filter(
    childQuestion => {
      const value =
        liveFormData[
          childQuestion.field as keyof ModelPlanQuestionsFormTypeWithLinks
        ];

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

const getBasicsFormData = (data: ModelPlanQuestionsFormTypeWithLinks) => {
  return {
    modelCategory: data.modelCategory,
    additionalModelCategories: data.additionalModelCategories,
    cmsCenters: data.cmsCenters,
    cmmiGroups: data.cmmiGroups
  };
};

const getGeneralCharacteristicsFormData = (
  data: ModelPlanQuestionsFormTypeWithLinks
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
  initialValues: ModelPlanQuestionsFormTypeWithLinks,
  currentValues: ModelPlanQuestionsFormTypeWithLinks
) => {
  const basicsChanges = dirtyInput(
    getBasicsFormData(initialValues),
    getBasicsFormData(currentValues)
  );

  const generalCharacteristicsChanges = dirtyInput(
    getGeneralCharacteristicsFormData(initialValues),
    getGeneralCharacteristicsFormData(currentValues)
  );

  if ('existingModel' in generalCharacteristicsChanges) {
    const { existingModel } = generalCharacteristicsChanges;

    if (
      existingModel === undefined ||
      existingModel === null ||
      existingModel === ''
    ) {
      generalCharacteristicsChanges.currentModelPlanID = null;
      generalCharacteristicsChanges.existingModelID = null;
    } else if (existingModel.includes('-')) {
      generalCharacteristicsChanges.currentModelPlanID = existingModel;
    } else {
      generalCharacteristicsChanges.existingModelID = Number(existingModel);
    }
  }

  const resemblesChangesArray =
    generalCharacteristicsChanges.resemblesExistingModelLinks;
  const participationChangesArray =
    generalCharacteristicsChanges.participationInModelPreconditionLinks;

  const withResemblesLinks =
    resemblesChangesArray?.length > 0 ||
    symmetricDifference(
      initialValues.resemblesExistingModelLinks || [],
      currentValues.resemblesExistingModelLinks || []
    ).length > 0;

  const withParticipationLinks =
    participationChangesArray?.length > 0 ||
    symmetricDifference(
      initialValues.participationInModelPreconditionLinks || [],
      currentValues.participationInModelPreconditionLinks || []
    ).length > 0;

  // delete frontend only fields, should not go to backend
  delete generalCharacteristicsChanges.existingModel;
  delete generalCharacteristicsChanges.resemblesExistingModelLinks;
  delete generalCharacteristicsChanges.participationInModelPreconditionLinks;

  return {
    basicsChanges,
    withBasics: Object.keys(basicsChanges).length > 0,

    generalCharacteristicsChanges,
    withGeneralCharacteristics:
      Object.keys(generalCharacteristicsChanges).length > 0,

    withResemblesLinks,
    withParticipationLinks
  };
};

type SeparateLinksType = {
  existingModelIDs: number[];
  currentModelPlanIDs: string[];
};

export const separateLinksByType = (
  existingLinks: string[],
  existingModelPlans: GetModelPlanQuestionsQuery['existingModelCollection'],
  currentModelPlans: GetModelPlanQuestionsQuery['modelPlanCollection']
): SeparateLinksType => {
  // 1. Filter existing model plans based on existingModelID(INT)
  const existingModelIDs = existingLinks
    .filter(linkID =>
      existingModelPlans.find(modelPlan => String(modelPlan.id) === linkID)
    )
    .map(Number); // Convert safely back to a number[] array for the backend mutation

  // 2. Filter MINT model plans base on id(UUID)
  const currentModelPlanIDs = existingLinks.filter(linkID =>
    currentModelPlans.find(modelPlan => modelPlan.id === linkID)
  );

  return {
    existingModelIDs,
    currentModelPlanIDs
  };
};

function isValidQuestionField(
  field: string,
  config: CombinedConfigType
): field is QuestionFieldType {
  return field in config;
}

export const getSubQuestionFields = (
  question: QuestionFieldType,
  value: unknown,
  config: CombinedConfigType
): {
  childQuestionFields: QuestionFieldType[];
  optionsRelatedQuestionFields: QuestionFieldType[];
} => {
  const translationKey = getTranslationKey(question);

  const currentConfig = config[translationKey as keyof CombinedConfigType];

  if (!currentConfig)
    return { childQuestionFields: [], optionsRelatedQuestionFields: [] };

  const childQuestionFields: QuestionFieldType[] = [];
  const optionsRelatedQuestionFields: QuestionFieldType[] = [];

  const valueArray = Array.isArray(value) ? value : [value];

  valueArray.forEach(val => {
    if (val == null || val === '') return;
    const valueString = String(val);

    // Child Relations (Nested questions)
    if (isTranslationFieldPropertiesWithOptionsAndChildren(currentConfig)) {
      const children =
        currentConfig.childRelation?.[
          valueString as keyof typeof currentConfig.childRelation
        ];

      children?.forEach(fn => {
        const childConfig = fn();
        const { gqlField } = childConfig;

        if (gqlField && isValidQuestionField(gqlField, config)) {
          const activeFormKey = getFormStateKey(gqlField);
          childQuestionFields.push(activeFormKey as QuestionFieldType);
        }
      });
    }

    // Options Related Info ("Other" fields)
    if (isTranslationFieldPropertiesWithOptions(currentConfig)) {
      const otherQuestion =
        currentConfig.optionsRelatedInfo?.[
          valueString as keyof typeof currentConfig.optionsRelatedInfo
        ];

      if (otherQuestion) {
        const activeFormKey = getFormStateKey(otherQuestion);
        optionsRelatedQuestionFields.push(activeFormKey as QuestionFieldType);
      }
    }
  });

  return { childQuestionFields, optionsRelatedQuestionFields };
};

export const getDeepChildFields = (
  fields: QuestionFieldType[],
  config: CombinedConfigType
): QuestionFieldType[] => {
  const deepFields: QuestionFieldType[] = [];

  fields.forEach(field => {
    const fieldTranslationKey = getTranslationKey(field);
    const childConfig = config[fieldTranslationKey as keyof CombinedConfigType];

    const managedOtherField =
      MULTI_SELECT_WITH_OTHER[field as keyof typeof MULTI_SELECT_WITH_OTHER];
    if (managedOtherField) {
      deepFields.push(managedOtherField as QuestionFieldType);
    }

    if (childConfig && isTranslationFieldPropertiesWithOptions(childConfig)) {
      if (childConfig.optionsRelatedInfo) {
        Object.values(childConfig.optionsRelatedInfo).forEach(relField => {
          if (relField) {
            deepFields.push(relField as QuestionFieldType);

            deepFields.push(
              ...getDeepChildFields([relField as QuestionFieldType], config)
            );
          }
        });
      }
    }

    if (
      childConfig &&
      isTranslationFieldPropertiesWithOptionsAndChildren(childConfig) &&
      childConfig.childRelation
    ) {
      Object.values(childConfig.childRelation).forEach(relationFunctions => {
        if (Array.isArray(relationFunctions)) {
          relationFunctions.forEach((fn: any) => {
            const childField = fn().gqlField as QuestionFieldType;
            if (childField) {
              deepFields.push(childField);

              deepFields.push(...getDeepChildFields([childField], config));
            }
          });
        }
      });
    }
  });

  return deepFields;
};

export const filterSuggestedWaiversByType = (
  suggestedWaivers: SuggestedCommonWaiverFragment[],
  waiverType: CommonWaiverType
) => {
  return suggestedWaivers.filter(waiver => waiver.waiverType === waiverType);
};
