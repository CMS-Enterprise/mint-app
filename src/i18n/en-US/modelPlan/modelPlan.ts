import { TranslationModelPlan } from 'types/translation';

const modelPlan: TranslationModelPlan = {
  modelName: {
    gqlField: 'modelName',
    goField: 'ModelName',
    dbField: 'model_name',
    label: 'Model name',
    dataType: 'string',
    formType: 'text'
  },
  previousName: {
    gqlField: 'previousName',
    goField: 'PreviousName',
    dbField: 'previous_name',
    label: 'Previous names',
    dataType: 'string',
    formType: 'text'
  },
  abbreviation: {
    gqlField: 'abbreviation',
    goField: 'abbreviation',
    dbField: 'abbreviation',
    label: 'Short name',
    sublabel:
      'The abbreviation, acronym, or other common name used for the model.',
    dataType: 'string',
    formType: 'text'
  }
};

export default modelPlan;
