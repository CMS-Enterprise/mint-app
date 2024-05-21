import { TranslationExistingModelLink } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const existingModelLink: TranslationExistingModelLink = {
  existingModelID: {
    gqlField: 'existingModelID',
    goField: 'ExistingModelID',
    dbField: 'existing_model_id',
    label: 'Existing Model ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    tableReference: 'existing_model'
  },
  currentModelPlanID: {
    gqlField: 'currentModelPlanID',
    goField: 'currentModelPlanID',
    dbField: 'current_model_plan_id',
    label: 'Current Model Plan ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    tableReference: 'model_plan'
  },
  fieldName: {
    gqlField: 'fieldName',
    goField: 'FieldName',
    dbField: 'field_name',
    label: 'What question is this link for?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    options: {
      GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH:
        'Which existing models does your proposed track/model most closely resemble?',
      GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH:
        'Which existing models is participation in a precondition for participation in this model?'
    }
  }
};

export default existingModelLink;
