import { TranslationExistingModelLink } from 'types/translation';

import {
  TranslationDataType,
  TranslationFormType
} from '../../../gql/gen/graphql';

export const existingModelLink: TranslationExistingModelLink = {
  exsitingModelID: {
    gqlField: 'exsitingModelID',
    goField: 'ExsitingModelID',
    dbField: 'exsiting_model_id',
    label: 'Exsiting Model ID',
    dataType: TranslationDataType.STRING,
    formType: TranslationFormType.TEXT
  }
};

export default existingModelLink;
