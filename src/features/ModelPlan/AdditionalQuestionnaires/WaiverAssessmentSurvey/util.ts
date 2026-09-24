import {
  GetAllWaiverAssessmentSurveyQuery,
  GetModelPlanQuestionsQuery,
  GetWaiversQuery,
  WaiverSelectionInput
} from 'gql/generated/graphql';

import { waiverAssessmentSurvey } from 'i18n/en-US/modelPlan/waiverAssessmentSurvey';
import {
  Bool,
  isTranslationFieldPropertiesWithOptions,
  isTranslationFieldPropertiesWithOptionsAndChildren,
  TranslationConfigType,
  TranslationFieldPropertiesWithOptionsAndChildren,
  TranslationPlan
} from 'types/translation';
import { WaiverSelectionFields, WaiverSelectionForm } from 'types/waivers';
import dirtyInput, { sortByName, symmetricDifference } from 'utils/formUtil';

import {
  CombinedConfigType,
  ModelPlanQuestionsFormTypeWithLinks
} from './_components/ModelPlanQuestionsForm';
import {
  MULTI_SELECT_WITH_OTHER,
  QuestionFieldType,
  QuestionType
} from './_components/ModelPlanQuestionsForm/questionMap';
import { SelectedWaiver } from './_components/WaiverSelectionSection';

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

/**
 * Merges suggested waivers with user-selected unused/other waivers for display in suggested waivers section.
 */
export const getSuggestedOrInUseWaivers = (
  waiverSelection: SelectedWaiver[],
  formWaivers: WaiverSelectionForm['waivers']
): SelectedWaiver[] => {
  const suggestedCommonWaivers = waiverSelection
    .filter(waiver => waiver.isSuggested)
    .sort(sortByName);

  // Waiver that is not suggested but is selected by the user (willUseWaiver = true)
  const inUseNotSuggestedCommonWaivers = waiverSelection
    .filter(waiver => {
      const isCurrentlySelected = formWaivers[waiver.id]
        ? formWaivers[waiver.id].willUseWaiver
        : waiver.willUseWaiver;

      return !waiver.isSuggested && isCurrentlySelected;
    })
    .sort(sortByName);

  return [...suggestedCommonWaivers, ...inUseNotSuggestedCommonWaivers];
};

/**
 * Returns not selected waivers still available for selection in the table.
 */
export const getUnselectedWaivers = (
  waiverSelection: SelectedWaiver[],
  formWaivers: WaiverSelectionForm['waivers']
): SelectedWaiver[] => {
  return waiverSelection
    .filter(waiver => {
      const isCurrentlySelected = formWaivers[waiver.id]
        ? formWaivers[waiver.id].willUseWaiver
        : waiver.willUseWaiver;

      return !waiver.isSuggested && !isCurrentlySelected;
    })
    .sort(sortByName);
};

/**
 * Builds react-hook-form values for waiver selection from GetWaivers query data.
 * Suggested waivers default to unanswered; existing waiver rows overlay saved answers.
 */
export const buildWaiverSelectionFormValues = (
  modelPlan: GetWaiversQuery['modelPlan'] | undefined | null
): WaiverSelectionForm => {
  const waivers: Record<string, WaiverSelectionFields> = {};

  modelPlan?.waiverInfo.commonWaivers.forEach(waiver => {
    waivers[waiver.id] = {
      willUseWaiver: waiver.willUseWaiver ?? null,
      notUsingReason: waiver.notUsingReason ?? '',
      usingReason: waiver.usingReason ?? ''
    };
  });

  const isEmptyWaiversConfirmed =
    modelPlan?.questionnaires.waiverAssessmentSurvey.isEmptyWaiversConfirmed ??
    null;

  return { waivers, isEmptyWaiversConfirmed };
};

const waiverSelectionFieldsChanged = (
  initial: WaiverSelectionFields | undefined,
  current: WaiverSelectionFields
) => {
  if (!initial) {
    return true;
  }

  return (
    initial.willUseWaiver !== current.willUseWaiver ||
    initial.notUsingReason !== current.notUsingReason ||
    initial.usingReason !== current.usingReason
  );
};

/**
 * Returns WaiverSelectionInput entries for waivers the user has answered and modified.
 */
export const getWaiverSelectionChanges = (
  initial: WaiverSelectionForm,
  current: WaiverSelectionForm
): WaiverSelectionInput[] => {
  const commonWaiverIDs = new Set([
    ...Object.keys(initial.waivers),
    ...Object.keys(current.waivers)
  ]);

  const changes: WaiverSelectionInput[] = [];

  commonWaiverIDs.forEach(commonWaiverID => {
    const currentFields = current.waivers[commonWaiverID];
    const initialFields = initial.waivers[commonWaiverID];

    if (!currentFields) {
      return;
    }

    if (!waiverSelectionFieldsChanged(initialFields, currentFields)) {
      return;
    }

    // Handle when willUseWaiver is false or null.
    // We preserve the original DB value for usingReason.
    const usingReason =
      currentFields.willUseWaiver !== true
        ? initialFields?.usingReason || null
        : currentFields.usingReason || null;

    // Handle when willUseWaiver is true or null.
    // We preserve the original DB value for notUsingReason.
    const notUsingReason =
      currentFields.willUseWaiver !== false
        ? initialFields?.notUsingReason || null
        : currentFields.notUsingReason || null;

    changes.push({
      commonWaiverID,
      willUseWaiver: currentFields.willUseWaiver,
      usingReason,
      notUsingReason
    });
  });

  return changes;
};

type WaiverAssessmentSurveyModelPlan =
  GetAllWaiverAssessmentSurveyQuery['modelPlan'];

type WaiverAssessmentSurveyGeneralCharacteristics =
  WaiverAssessmentSurveyModelPlan['generalCharacteristics'];

export type WaiverAssessmentSurveyQuestionConfigs = {
  modelPlanQuestionsConfig: Record<string, TranslationConfigType<string>>;
  waiverSurveyQuestionsConfig: Record<string, TranslationConfigType<string>>;
};

export type WaiverAssessmentSurveySectionHeadings = {
  modelPlanQuestions: string;
  waiverSurveyQuestions: string;
};

export type WaiverQuestionsSectionsConfig = {
  modelPlanQuestions: {
    heading: string;
    config: Record<string, TranslationConfigType<string>>;
    href: string;
  };
  waiverSurveyQuestions: {
    heading: string;
    config: Record<string, TranslationConfigType<string>>;
    href: string;
  };
};

/**
 * Builds translation configs for waiver questions read-only sections.
 */
export const buildWaiverQuestionConfigs = (
  modelBasicsConfig: TranslationPlan['basics'],
  generalCharacteristicsConfig: TranslationPlan['generalCharacteristics'],
  waiverAssessmentSurveyConfig: TranslationPlan['waiverAssessmentSurvey']
): WaiverAssessmentSurveyQuestionConfigs => ({
  modelPlanQuestionsConfig: {
    modelCategory: modelBasicsConfig.modelCategory,
    additionalModelCategories: modelBasicsConfig.additionalModelCategories,
    cmsCenters: modelBasicsConfig.cmsCenters,
    cmmiGroups: modelBasicsConfig.cmmiGroups,
    isNewModel: generalCharacteristicsConfig.isNewModel,
    existingModel: generalCharacteristicsConfig.existingModel,
    resemblesExistingModel: generalCharacteristicsConfig.resemblesExistingModel,
    resemblesExistingModelWhich:
      generalCharacteristicsConfig.resemblesExistingModelWhich,
    participationInModelPrecondition:
      generalCharacteristicsConfig.participationInModelPrecondition,
    participationInModelPreconditionWhich:
      generalCharacteristicsConfig.participationInModelPreconditionWhich,
    keyCharacteristics: generalCharacteristicsConfig.keyCharacteristics,
    keyCharacteristicsOther:
      generalCharacteristicsConfig.keyCharacteristicsOther,
    collectPlanBids: generalCharacteristicsConfig.collectPlanBids,
    managePartCDEnrollment: generalCharacteristicsConfig.managePartCDEnrollment,
    planContractUpdated: generalCharacteristicsConfig.planContractUpdated,
    geographiesTargeted: generalCharacteristicsConfig.geographiesTargeted,
    geographiesTargetedTypes:
      generalCharacteristicsConfig.geographiesTargetedTypes,
    geographiesStatesAndTerritories:
      generalCharacteristicsConfig.geographiesStatesAndTerritories,
    geographiesRegionTypes: generalCharacteristicsConfig.geographiesRegionTypes,
    geographiesTargetedTypesOther:
      generalCharacteristicsConfig.geographiesTargetedTypesOther,
    geographiesTargetedAppliedTo:
      generalCharacteristicsConfig.geographiesTargetedAppliedTo,
    geographiesTargetedAppliedToOther:
      generalCharacteristicsConfig.geographiesTargetedAppliedToOther,
    waiversRequired: generalCharacteristicsConfig.waiversRequired,
    waiversRequiredTypes: generalCharacteristicsConfig.waiversRequiredTypes
  },
  waiverSurveyQuestionsConfig: {
    modifiesMedicareSavingsPrograms:
      waiverAssessmentSurveyConfig.modifiesMedicareSavingsPrograms,
    bundlesPayments: waiverAssessmentSurveyConfig.bundlesPayments,
    offersRiskSharingArrangements:
      waiverAssessmentSurveyConfig.offersRiskSharingArrangements,
    impactsSiteOfCarePayments:
      waiverAssessmentSurveyConfig.impactsSiteOfCarePayments,
    modifiesCareTeamScopeOfPractice:
      waiverAssessmentSurveyConfig.modifiesCareTeamScopeOfPractice,
    modifiesCareDeliveryWithClaimsBasedPayments:
      waiverAssessmentSurveyConfig.modifiesCareDeliveryWithClaimsBasedPayments,
    modifiesQualityMeasurementsOrPaymentsViaWaivers:
      waiverAssessmentSurveyConfig.modifiesQualityMeasurementsOrPaymentsViaWaivers,
    impactsMedicaidOnlyBeneficiaries:
      waiverAssessmentSurveyConfig.impactsMedicaidOnlyBeneficiaries,
    impactsHomeCommunityBasedServicePayments:
      waiverAssessmentSurveyConfig.impactsHomeCommunityBasedServicePayments,
    impactsManagedCareWaivers:
      waiverAssessmentSurveyConfig.impactsManagedCareWaivers,
    offersPatientIncentivesSafeHarborProtection:
      waiverAssessmentSurveyConfig.offersPatientIncentivesSafeHarborProtection,
    offersExpensesRemunerationSafeHarborProtection:
      waiverAssessmentSurveyConfig.offersExpensesRemunerationSafeHarborProtection
  }
});

/**
 * Builds section headings and configs for waiver questions read-only views.
 */
export const buildWaiverQuestionsSectionsConfig = (
  questionConfigs: WaiverAssessmentSurveyQuestionConfigs,
  headings: WaiverAssessmentSurveySectionHeadings
): WaiverQuestionsSectionsConfig => ({
  modelPlanQuestions: {
    heading: headings.modelPlanQuestions,
    config: questionConfigs.modelPlanQuestionsConfig,
    href: '../model-plan-questions'
  },
  waiverSurveyQuestions: {
    heading: headings.waiverSurveyQuestions,
    config: questionConfigs.waiverSurveyQuestionsConfig,
    href: '../active-model-waivers'
  }
});

/**
 * Adds "Other" to linked plan lists when the corresponding other-selected flag is true.
 */
export const buildLinkedResemblePlans = (
  resemblesExistingModelWhich:
    | WaiverAssessmentSurveyGeneralCharacteristics['resemblesExistingModelWhich']
    | undefined,
  resemblesExistingModelOtherSelected?: boolean | null
): string[] => {
  const selectedPlans = [
    ...(resemblesExistingModelWhich?.names
      ? [...resemblesExistingModelWhich.names]
      : [])
  ];

  if (resemblesExistingModelOtherSelected) {
    selectedPlans.push('Other');
  }

  return selectedPlans;
};

/**
 * Adds "Other" to participation precondition plan lists when the other-selected flag is true.
 */
export const buildParticipationPreconditionPlans = (
  participationInModelPreconditionWhich:
    | WaiverAssessmentSurveyGeneralCharacteristics['participationInModelPreconditionWhich']
    | undefined,
  participationInModelPreconditionOtherSelected?: boolean | null
): string[] => {
  const selectedPlans = [
    ...(participationInModelPreconditionWhich?.names
      ? [...participationInModelPreconditionWhich.names]
      : [])
  ];

  if (participationInModelPreconditionOtherSelected) {
    selectedPlans.push('Other');
  }

  return selectedPlans;
};

/**
 * Builds merged model plan question values for waiver model questions read-only views.
 */
export const buildWaiverModelQuestionsData = (
  basics: WaiverAssessmentSurveyModelPlan['basics'],
  generalCharacteristics: WaiverAssessmentSurveyGeneralCharacteristics
) => ({
  ...basics,
  ...generalCharacteristics,
  resemblesExistingModelWhich: buildLinkedResemblePlans(
    generalCharacteristics.resemblesExistingModelWhich,
    generalCharacteristics.resemblesExistingModelOtherSelected
  ),
  participationInModelPreconditionWhich: buildParticipationPreconditionPlans(
    generalCharacteristics.participationInModelPreconditionWhich,
    generalCharacteristics.participationInModelPreconditionOtherSelected
  )
});

const WAIVER_SURVEY_PARENT_QUESTION_CONFIGS = [
  waiverAssessmentSurvey.modifiesMedicareSavingsPrograms,
  waiverAssessmentSurvey.bundlesPayments,
  waiverAssessmentSurvey.offersRiskSharingArrangements,
  waiverAssessmentSurvey.impactsSiteOfCarePayments,
  waiverAssessmentSurvey.modifiesCareTeamScopeOfPractice,
  waiverAssessmentSurvey.modifiesCareDeliveryWithClaimsBasedPayments,
  waiverAssessmentSurvey.modifiesQualityMeasurementsOrPaymentsViaWaivers,
  waiverAssessmentSurvey.impactsMedicaidOnlyBeneficiaries,
  waiverAssessmentSurvey.impactsHomeCommunityBasedServicePayments,
  waiverAssessmentSurvey.impactsManagedCareWaivers,
  waiverAssessmentSurvey.offersPatientIncentivesSafeHarborProtection,
  waiverAssessmentSurvey.offersExpensesRemunerationSafeHarborProtection
] as const;

type WaiverSurveyQuestionnaireData =
  GetAllWaiverAssessmentSurveyQuery['modelPlan']['questionnaires']['waiverAssessmentSurvey'];

type WaiverSelectionData =
  GetAllWaiverAssessmentSurveyQuery['modelPlan']['waiverInfo']['commonWaivers'];

const isNonEmptyString = (value: unknown): boolean =>
  typeof value === 'string' && value.trim() !== '';

const isSelectedEnum = (value: unknown): boolean =>
  value !== null && value !== undefined && value !== '';

/**
 * Returns true when a single yes/no waiver question and its conditional child are complete.
 */
export const isWaiverSurveyQuestionComplete = (
  questionConfig: TranslationFieldPropertiesWithOptionsAndChildren<Bool, void>,
  surveyData: Record<string, unknown>
): boolean => {
  const parentValue = surveyData[questionConfig.gqlField];

  if (parentValue === null || parentValue === undefined) {
    return false;
  }

  if (parentValue === true) {
    const exampleField =
      questionConfig.childRelation?.[Bool.true]?.[0]?.().gqlField;

    return exampleField ? isNonEmptyString(surveyData[exampleField]) : false;
  }

  if (parentValue === false) {
    const whyNotField =
      questionConfig.childRelation?.[Bool.false]?.[0]?.().gqlField;

    return whyNotField ? isSelectedEnum(surveyData[whyNotField]) : false;
  }

  return false;
};

/**
 * Returns true when all pages 3–5 waiver question fields are complete.
 */
export const isWaiverSurveyQuestionsComplete = (
  surveyData: WaiverSurveyQuestionnaireData | undefined
): boolean => {
  if (!surveyData) {
    return false;
  }

  const allParentQuestionsComplete =
    WAIVER_SURVEY_PARENT_QUESTION_CONFIGS.every(questionConfig =>
      isWaiverSurveyQuestionComplete(
        questionConfig,
        surveyData as Record<string, unknown>
      )
    );

  return allParentQuestionsComplete;
};

export const isWaiverSelectionComplete = (
  waiverSelectionData: WaiverSelectionData | undefined
): boolean => {
  if (!waiverSelectionData) {
    return false;
  }

  const allWaiversSelected = waiverSelectionData.every(waiver => {
    const isAnswered =
      waiver.willUseWaiver !== null && waiver.willUseWaiver !== undefined;

    if (waiver.isSuggested && isAnswered) {
      return waiver.willUseWaiver
        ? true
        : isNonEmptyString(waiver.notUsingReason);
    }

    if (waiver.isSuggested === false) {
      return waiver.willUseWaiver === true
        ? isNonEmptyString(waiver.usingReason)
        : true;
    }

    return false;
  });

  return allWaiversSelected;
};
