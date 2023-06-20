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
  }
};

export default modelPlan;
