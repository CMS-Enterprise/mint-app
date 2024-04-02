/*
  Util for formatting and transforming Typescript translation file to JSON
  Output filename/directory - /mappings/translations/model_plan_translations.json
  For BE use for storing translated data to database
*/
import * as fs from 'fs';

import basics from './i18n/en-US/modelPlan/basics';
import beneficiaries from './i18n/en-US/modelPlan/beneficiaries';
import collaborators from './i18n/en-US/modelPlan/collaborators';
import generalCharacteristics from './i18n/en-US/modelPlan/generalCharacteristics';
import modelPlan from './i18n/en-US/modelPlan/modelPlan';
import opsEvalAndLearning from './i18n/en-US/modelPlan/opsEvalAndLearning';
import participantsAndProviders from './i18n/en-US/modelPlan/participantsAndProviders';
import payments from './i18n/en-US/modelPlan/payments';
import {
  getKeys,
  TranslationFieldProperties,
  TranslationPlanSection
} from './types/translation';

export const translationSections = {
  model_plan: modelPlan,
  plan_basics: basics,
  plan_general_characteristics: generalCharacteristics,
  plan_participants_and_providers: participantsAndProviders,
  plan_beneficiaries: beneficiaries,
  plan_ops_eval_and_learning: opsEvalAndLearning,
  plan_payments: payments,
  plan_collaborators: collaborators
};

export const unneededFields: string[] = [
  'dataType',
  'formType',
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
  'disconnectedLabel',
  'parentRelation',
  'childRelation'
];

// Removes fields from export that are not needed by BE
export const filterUnneededField = (
  translationsObj: TranslationFieldProperties,
  fieldsToExclude: string[]
) => {
  const filteredObj: any = {};
  getKeys(translationsObj).forEach(subField => {
    if (!fieldsToExclude.includes(subField)) {
      filteredObj[subField] = translationsObj[subField];
    }
  });
  return filteredObj;
};

export const mapOtherParentFieldToDBField = (
  planSection: TranslationPlanSection
) => {
  const formattedSection = { ...planSection };
  getKeys(formattedSection).forEach(field => {
    const fieldObj = planSection[field] as any;

    if (fieldObj.otherParentField) {
      const parentObj =
        planSection[fieldObj.otherParentField as keyof TranslationPlanSection];
      fieldObj.otherParentField = parentObj.dbField;
    }

    const sectionName: keyof typeof planSection = fieldObj.gqlField;

    formattedSection[sectionName] = fieldObj;
  });
  return formattedSection;
};

// Restructures translations to key off db_field rather than gql_field
export const mapDBFieldToKey = (translations: typeof translationSections) => {
  const formattedTranslation: any = {};

  getKeys(translations).forEach((section: keyof typeof translationSections) => {
    formattedTranslation[section] = {};

    const planSection = translations[section] as TranslationPlanSection;

    const formattedOtherParentFields = mapOtherParentFieldToDBField(
      planSection
    );

    getKeys(formattedOtherParentFields).forEach(field => {
      const fieldObj = formattedOtherParentFields[
        field
      ] as TranslationFieldProperties;

      const filteredObj = filterUnneededField(fieldObj, unneededFields);

      formattedTranslation[section][fieldObj.dbField] = filteredObj;
    });
  });

  return formattedTranslation;
};

const parseTypscriptToJSON = (translations: any, outputFile: string) => {
  const jsonString = JSON.stringify(translations, null, 2);

  fs.writeFileSync(outputFile, jsonString);
};

function main() {
  const transformedTranslationSections = mapDBFieldToKey(translationSections);

  // Create JSON file for each translation task list section
  getKeys(transformedTranslationSections).forEach(section =>
    parseTypscriptToJSON(
      transformedTranslationSections[section],
      `./mappings/translation/${String(section)}.json`
    )
  );
}

module.exports = { main };
