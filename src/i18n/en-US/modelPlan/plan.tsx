import { TranslationModelPlan } from 'types/translation';

const modelPlan: TranslationModelPlan = {
  modelName: {
    gqlField: 'modelName',
    goField: 'ModelName',
    dbField: 'model_name',
    question: 'Model name',
    dataType: 'string',
    formType: 'text'
  },
  previousName: {
    gqlField: 'previousName',
    goField: 'PreviousName',
    dbField: 'previous_name',
    question: 'Previous names',
    dataType: 'string',
    formType: 'text'
  },
  abbreviation: {
    gqlField: 'abbreviation',
    goField: 'abbreviation',
    dbField: 'abbreviation',
    question: 'Short name',
    hint: 'The abbreviation, acronym, or other common name used for the model.',
    dataType: 'string',
    formType: 'text'
  }
};

export default modelPlan;
