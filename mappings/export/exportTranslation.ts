/*
  Export for FE translation files
  Output filename/directory - /mappings/translations/model_plan_translations.json
  For BE use for storing translated data to database
*/
import * as fs from 'fs';

import basics from '../../src/i18n/en-US/modelPlan/basics';
import beneficiaries from '../../src/i18n/en-US/modelPlan/beneficiaries';
import collaborators from '../../src/i18n/en-US/modelPlan/collaborators';
import crs from '../../src/i18n/en-US/modelPlan/crs';
import discussions from '../../src/i18n/en-US/modelPlan/discussions';
import documents from '../../src/i18n/en-US/modelPlan/documents';
import generalCharacteristics from '../../src/i18n/en-US/modelPlan/generalCharacteristics';
import modelPlan from '../../src/i18n/en-US/modelPlan/modelPlan';
import operationalNeeds from '../../src/i18n/en-US/modelPlan/operationalNeeds';
import subtasks from '../../src/i18n/en-US/modelPlan/operationalSolutionSubtasks';
import opsEvalAndLearning from '../../src/i18n/en-US/modelPlan/opsEvalAndLearning';
import participantsAndProviders from '../../src/i18n/en-US/modelPlan/participantsAndProviders';
import payments from '../../src/i18n/en-US/modelPlan/payments';
import replies from '../../src/i18n/en-US/modelPlan/replies';
import operationalSolutions from '../../src/i18n/en-US/modelPlan/solutions';
import tdls from '../../src/i18n/en-US/modelPlan/tdls';
import { getKeys } from '../../src/types/translation';

import { processDataMapping } from './util';

export const translationSections = {
  model_plan: modelPlan,
  plan_basics: basics,
  plan_general_characteristics: generalCharacteristics,
  plan_participants_and_providers: participantsAndProviders,
  plan_beneficiaries: beneficiaries,
  plan_ops_eval_and_learning: opsEvalAndLearning,
  plan_payments: payments,
  plan_collaborator: collaborators,
  plan_discussion: discussions,
  discussion_reply: replies,
  plan_document: documents,
  plan_cr: crs,
  plan_tdl: tdls,
  operational_need: operationalNeeds,
  operational_solution: operationalSolutions,
  operational_solution_subtask: subtasks
};

export const parseTypscriptToJSON = (translations: any, outputFile: string) => {
  const jsonString = JSON.stringify(translations, null, 2);

  fs.writeFileSync(outputFile, jsonString);
};

(function main() {
  const transformedTranslationSections = processDataMapping(
    translationSections
  );

  // Create JSON file for each translation task list section
  getKeys(transformedTranslationSections).forEach(section =>
    parseTypscriptToJSON(
      transformedTranslationSections[section],
      `./mappings/translation/${String(section)}.json`
    )
  );
})();
