import * as fs from 'fs';

import basics from '../src/i18n/en-US/modelPlan/basics';
import beneficiaries from '../src/i18n/en-US/modelPlan/beneficiaries';
import collaborators from '../src/i18n/en-US/modelPlan/collaborators';
import generalCharacteristics from '../src/i18n/en-US/modelPlan/generalCharacteristics';
import modelPlan from '../src/i18n/en-US/modelPlan/modelPlan';
import opsEvalAndLearning from '../src/i18n/en-US/modelPlan/opsEvalAndLearning';
import participantsAndProviders from '../src/i18n/en-US/modelPlan/participantsAndProviders';
import payments from '../src/i18n/en-US/modelPlan/payments';

const translationSections = {
  modelPlan,
  basics,
  generalCharacteristics,
  participantsAndProviders,
  beneficiaries,
  opsEvalAndLearning,
  payments,
  collaborators
};

const mapDBFieldToKey = translations => {
  const formattedTranslation = {};
  Object.keys(translations).forEach(section => {
    formattedTranslation[section] = {};
    Object.keys(translations[section]).forEach(field => {
      const fieldObj = translations[section][field];
      formattedTranslation[section][fieldObj.dbField] = fieldObj;
    });
  });
  return formattedTranslation;
};

// Function to parse TypeScript file
function parseTranslationFileToJSON() {
  const formattedTranslations = mapDBFieldToKey(translationSections);
  const jsonString = JSON.stringify(
    JSON.parse(JSON.stringify(formattedTranslations)),
    null,
    2
  );
  fs.writeFileSync(
    './mappings/translations/model_plan_translations.json',
    jsonString
  );
}

parseTranslationFileToJSON();
