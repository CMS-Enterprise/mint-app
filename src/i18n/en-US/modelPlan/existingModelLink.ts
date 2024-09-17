import { TranslationExistingModelLink } from 'types/translation';

import {
  TableName,
  TranslationDataType,
  TranslationFormType
} from '../../../gql/generated/graphql';

export const existingModelLink: TranslationExistingModelLink = {
  existingModelID: {
    gqlField: 'existingModelID',
    goField: 'ExistingModelID',
    dbField: 'existing_model_id',
    label: 'Existing Model ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.01,
    tableReference: TableName.EXISTING_MODEL
  },
  currentModelPlanID: {
    gqlField: 'currentModelPlanID',
    goField: 'currentModelPlanID',
    dbField: 'current_model_plan_id',
    label: 'Current Model Plan ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.02,
    tableReference: TableName.MODEL_PLAN
  },
  fieldName: {
    gqlField: 'fieldName',
    goField: 'FieldName',
    dbField: 'field_name',
    label: 'What question is this link for?',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT,
    order: 1.03,
    options: {
      GEN_CHAR_RESEMBLES_EXISTING_MODEL_WHICH:
        'Which existing models does your proposed track/model most closely resemble?',
      GEN_CHAR_PARTICIPATION_EXISTING_MODEL_WHICH:
        'Which existing models is participation in a precondition for participation in this model?'
    }
  }
};

export default existingModelLink;
