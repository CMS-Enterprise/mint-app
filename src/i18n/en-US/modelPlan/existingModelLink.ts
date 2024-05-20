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
    formType: TranslationFormType.TEXT
  }
};

export default existingModelLink;
