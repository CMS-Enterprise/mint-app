/*
  Util for formatting and transforming Typescript translation file to JSON
  For BE use for storing translated data to database
*/

import basics from '../../src/i18n/en-US/modelPlan/basics';
import beneficiaries from '../../src/i18n/en-US/modelPlan/beneficiaries';
import collaborator from '../../src/i18n/en-US/modelPlan/collaborators';
import crs from '../../src/i18n/en-US/modelPlan/crs';
import dataExchangeApproach from '../../src/i18n/en-US/modelPlan/dataExchangeApproach';
import discussion from '../../src/i18n/en-US/modelPlan/discussions';
import document from '../../src/i18n/en-US/modelPlan/documents';
import documentSolutionLink from '../../src/i18n/en-US/modelPlan/documentSolutionLink';
import existingModelLink from '../../src/i18n/en-US/modelPlan/existingModelLink';
import generalCharacteristics from '../../src/i18n/en-US/modelPlan/generalCharacteristics';
import modelPlan from '../../src/i18n/en-US/modelPlan/modelPlan';
import operationalNeed from '../../src/i18n/en-US/modelPlan/operationalNeeds';
import subtask from '../../src/i18n/en-US/modelPlan/operationalSolutionSubtasks';
import opsEvalAndLearning from '../../src/i18n/en-US/modelPlan/opsEvalAndLearning';
import participantsAndProviders from '../../src/i18n/en-US/modelPlan/participantsAndProviders';
import payments from '../../src/i18n/en-US/modelPlan/payments';
import reply from '../../src/i18n/en-US/modelPlan/replies';
import operationalSolution from '../../src/i18n/en-US/modelPlan/solutions';
import tdls from '../../src/i18n/en-US/modelPlan/tdls';
import {
  getKeys,
  TranslationFieldProperties,
  TranslationPlanSection
} from '../../src/types/translation';

export const translationSections = {
  model_plan: modelPlan,
  plan_basics: basics,
  plan_general_characteristics: generalCharacteristics,
  plan_participants_and_providers: participantsAndProviders,
  plan_beneficiaries: beneficiaries,
  plan_ops_eval_and_learning: opsEvalAndLearning,
  plan_payments: payments,
  plan_collaborator: collaborator,
  plan_discussion: discussion,
  discussion_reply: reply,
  plan_document: document,
  plan_cr: crs,
  plan_tdl: tdls,
  operational_need: operationalNeed,
  operational_solution: operationalSolution,
  operational_solution_subtask: subtask,
  existing_model_link: existingModelLink,
  plan_document_solution_link: documentSolutionLink,
  data_exchange_approach: dataExchangeApproach
};

// Fields that are not needed by BE
export const unneededFields: string[] = [
  'filterGroups',
  'tags',
  'isModelLinks',
  'isPageStart',
  'readonlyHeader',
  'adjacentPositioning',
  'hideRelatedQuestionAlert',
  'tooltips',
  'optionsRelatedInfo',
  'disconnectedChildren',
  'disconnectedLabel'
];

// Removes fields from export that are not needed by BE
export const filterUnneededField = (
  translationsObj: TranslationFieldProperties,
  fieldsToExclude: string[]
) => {
  const filteredObj: any = {};
  getKeys(translationsObj).forEach(subField => {
    if (!fieldsToExclude.includes(subField as string)) {
      filteredObj[subField] = translationsObj[subField];
    }
  });
  return filteredObj;
};

// Checks translation questions for 'otherParentField'
// Replaces gql field residing in 'otherParentField' with the dbField of the referenced parent
export const mapOtherParentFieldToDBField = (
  planSection: TranslationPlanSection
) => {
  const formattedSection = { ...planSection };
  getKeys(formattedSection).forEach(field => {
    const fieldObj = planSection[field] as any;

    const filteredObj = filterUnneededField(fieldObj, unneededFields);

    // If 'otherParentField' exists, replace gql field with dbField
    if (filteredObj.otherParentField) {
      const parentObj = planSection[
        filteredObj.otherParentField as keyof TranslationPlanSection
      ] as TranslationFieldProperties;
      filteredObj.otherParentField = parentObj.dbField;
    }

    // If 'parentRelation' exists, call the closure and filter out unneeded fields from parent
    if (filteredObj.parentRelation) {
      const parentObj = { ...filteredObj.parentRelation() };
      delete parentObj.childRelation;
      filteredObj.parentRelation = filterUnneededField(
        parentObj,
        unneededFields
      );
    }

    // If 'childRelation' exists, call the closure on each option that contains a child and filter out unneeded fields from children
    if (filteredObj.childRelation) {
      getKeys(filteredObj.childRelation).forEach(option => {
        const parentOption = filteredObj.childRelation[option];
        const calledClosures: TranslationFieldProperties[] = [];
        getKeys(parentOption).forEach((child, index) => {
          const childObj = parentOption[index]();
          calledClosures.push(
            filterUnneededField({ ...childObj }, unneededFields)
          );
        });
        filteredObj.childRelation[option] = calledClosures;
      });
    }

    formattedSection[field] = filteredObj;
  });
  return formattedSection;
};

// Processes translation data in prep for BE use for export
export const processDataMapping = (
  translations: typeof translationSections
) => {
  const formattedTranslation: any = {};

  getKeys(translations).forEach((section: keyof typeof translationSections) => {
    formattedTranslation[section] = {};

    const planSection = translations[section] as TranslationPlanSection;

    const formattedOtherParentFields =
      mapOtherParentFieldToDBField(planSection);

    formattedTranslation[section] = formattedOtherParentFields;
  });

  return formattedTranslation;
};
