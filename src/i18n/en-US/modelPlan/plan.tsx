import { TranslationFieldObject } from 'types/translation';

const plan: Record<string, TranslationFieldObject> = {
  modelName: {
    gqlField: 'modelName',
    goField: 'ModelName',
    dbField: 'model_name',
    question: 'Model name',
    dataType: 'string',
    formType: 'text'
  }
};

export default plan;
