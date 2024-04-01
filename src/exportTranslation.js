/*
  Util for formatting and transforming Typescript translation file to JSON
  Output filename/directory - /mappings/translations/model_plan_translations.json
  For BE use for storing translated data to database
*/
import * as fs from 'fs';

import basics from './i18n/en-US/modelPlan/basics';
// import beneficiaries from './i18n/en-US/modelPlan/beneficiaries';
// import collaborators from './i18n/en-US/modelPlan/collaborators';
// import generalCharacteristics from './i18n/en-US/modelPlan/generalCharacteristics';
// import modelPlan from './i18n/en-US/modelPlan/modelPlan';
// import opsEvalAndLearning from './i18n/en-US/modelPlan/opsEvalAndLearning';
// import participantsAndProviders from './i18n/en-US/modelPlan/participantsAndProviders';
// import payments from './i18n/en-US/modelPlan/payments';

const translationSections = {
  //   modelPlan,
  plan_basics: basics
  //   generalCharacteristics,
  //   participantsAndProviders,
  //   beneficiaries,
  //   opsEvalAndLearning,
  //   payments,
  //   collaborators
};

const unneededField = [
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
const filterUnneededField = translationsObj => {
  const filteredObj = {};
  Object.keys(translationsObj).forEach(subField => {
    if (!unneededField.includes(subField)) {
      filteredObj[subField] = translationsObj[subField];
    }
  });
  return filteredObj;
};

// Restructures translations to key off db_field rather than gql_field
const mapDBFieldToKey = translations => {
  const formattedTranslation = {};

  Object.keys(translations).forEach(section => {
    formattedTranslation[section] = {};

    Object.keys(translations[section]).forEach(field => {
      const fieldObj = translations[section][field];

      const filteredObj = filterUnneededField(fieldObj);

      formattedTranslation[section][fieldObj.dbField] = filteredObj;
    });
  });

  return formattedTranslation;
};

const parseTypscriptToJSON = (translations, outputFile) => {
  const jsonString = JSON.stringify(translations, null, 2);

  fs.writeFileSync(outputFile, jsonString);
};

(function main() {
  const transformedTranslationSections = mapDBFieldToKey(translationSections);

  // Create JSON file for each translation task list section
  Object.keys(transformedTranslationSections).forEach(section =>
    parseTypscriptToJSON(
      transformedTranslationSections[section],
      `./mappings/translation/${section}.json`
    )
  );
})();
